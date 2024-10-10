import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws.service';
import { diaryExceptionMessage } from 'src/constants/exceptionMessage';
import { UserDTO } from 'src/users/dto/user.dto';
import { Brackets, Repository } from 'typeorm';
import { DiaryEntity } from './diaries.entity';
import { DiaryFormDTO } from './dto/diary-form.dto';
import {
  DEFAULT_DIARY_SORT_BY,
  DEFAULT_SKIP,
  DEFAULT_TAKE,
} from 'src/constants/page';
import { UserToBadgesService } from 'src/user-to-badges/user-to-badges.service';
import { BadgeAcquisitionConditionForDiary } from 'src/constants/badgeAcquisitionCondition';
import { generateCustomFieldForDiary } from 'src/utility/customField';
import { sortByConverter } from './diaries.utils';

@Injectable()
export class DiariesService {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository: Repository<DiaryEntity>,
    private readonly awsService: AwsService,
    private readonly userToBadgesService: UserToBadgesService,
  ) {}
  async uploadImg(file: Express.Multer.File) {
    const uploadInfo = await this.awsService.uploadFileToS3('diaries', file);
    return { imgUrl: this.awsService.getAwsS3FileUrl(uploadInfo.key) };
  }

  async findOneById(id: string) {
    const diary = await this.diaryRepository.findOneBy({ id });

    if (!diary) {
      throw new NotFoundException(diaryExceptionMessage.DOES_NOT_EXIST_DIARY);
    }

    return diary;
  }

  generateSelectDiaryInstance() {
    const tableAliasInfo = {
      diary: 'diary',
      diaryAuthor: 'author',
      diaryFavorites: 'favorites',
      favoriteUser: 'favoriteUser',
      diaryBookmarks: 'bookmarks',
      bookmarksUser: 'bookmarkUser',
    };

    const selectDiaryInstance = this.diaryRepository
      .createQueryBuilder(tableAliasInfo.diary)
      .leftJoinAndSelect('diary.author', tableAliasInfo.diaryAuthor)
      .leftJoinAndSelect('diary.favorites', tableAliasInfo.diaryFavorites)
      .leftJoinAndSelect('favorites.user', tableAliasInfo.favoriteUser)
      .leftJoinAndSelect('diary.bookmarks', tableAliasInfo.diaryBookmarks)
      .leftJoinAndSelect('bookmarks.user', tableAliasInfo.bookmarksUser);

    return { selectDiaryInstance, tableAliasInfo };
  }

  async getDiaries(
    accessUser: UserDTO,
    targetProfileUsername?: string,
    searchKeyword?: string | undefined,
    take = DEFAULT_TAKE,
    skip = DEFAULT_SKIP,
    sortBy = DEFAULT_DIARY_SORT_BY,
  ) {
    const { selectDiaryInstance, tableAliasInfo } =
      this.generateSelectDiaryInstance();

    targetProfileUsername === undefined
      ? selectDiaryInstance // 전체 일기 조회
          .where(`${tableAliasInfo.diary}.isPublic = true`)
          .orWhere(`${tableAliasInfo.diaryAuthor}.id = :accessUserId`, {
            accessUserId: accessUser.id,
          })
      : selectDiaryInstance // 특정 유저가 작성한 일기 조회
          .where(`${tableAliasInfo.diaryAuthor}.username = :username`, {
            username: targetProfileUsername,
          })
          .andWhere(
            new Brackets((qb) => {
              qb.where(`${tableAliasInfo.diary}.isPublic = true`).orWhere(
                `${tableAliasInfo.diaryAuthor}.id = :accessUserId`,
                {
                  accessUserId: accessUser.id,
                },
              );
            }),
          );

    if (searchKeyword) {
      selectDiaryInstance
        .where(`${tableAliasInfo.diaryAuthor}.username ILIKE :searchKeyword`, {
          searchKeyword: `%${searchKeyword}%`,
        })
        .orWhere(`${tableAliasInfo.diary}.title ILIKE :searchKeyword`, {
          searchKeyword: `%${searchKeyword}%`,
        })
        .orWhere(`${tableAliasInfo.diary}.content ILIKE :searchKeyword`, {
          searchKeyword: `%${searchKeyword}%`,
        });
    }

    if (sortByConverter[sortBy] === undefined)
      throw new BadRequestException(diaryExceptionMessage.INVALID_SORT_BY);

    const [diaries, totalCount] = await selectDiaryInstance
      .orderBy(`${tableAliasInfo.diary}.${sortByConverter[sortBy]}`, 'DESC')
      .take(take)
      .skip(skip)
      .getManyAndCount();

    const resultDiaries = diaries.map((diary) => {
      return generateCustomFieldForDiary(diary, accessUser.id);
    });

    return {
      diaries: resultDiaries,
      totalCount,
      totalPage: Math.ceil(totalCount / take),
    };
  }

  async getOne(id: string, accessUser: UserDTO) {
    const { selectDiaryInstance, tableAliasInfo } =
      await this.generateSelectDiaryInstance();

    const diaryByDiaryId = await selectDiaryInstance
      .where(`${tableAliasInfo.diary}.id = :id`, { id })
      .getOne();

    if (!diaryByDiaryId) {
      throw new NotFoundException(diaryExceptionMessage.DOES_NOT_EXIST_DIARY);
    }
    return generateCustomFieldForDiary(diaryByDiaryId, accessUser.id);
  }

  async getDiariesByUsersBookmark(
    accessUser: UserDTO,
    targetProfileUsername: string,
    searchKeyword?: string | undefined,
    take = DEFAULT_TAKE,
    skip = DEFAULT_SKIP,
    sortBy = DEFAULT_DIARY_SORT_BY,
  ) {
    const { selectDiaryInstance, tableAliasInfo } =
      this.generateSelectDiaryInstance();

    const diariesByUsername = selectDiaryInstance
      .where(`${tableAliasInfo.bookmarksUser}.username = :username`, {
        username: targetProfileUsername,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`${tableAliasInfo.diary}.isPublic = true`).orWhere(
            `${tableAliasInfo.diaryAuthor}.id = :accessUserId`,
            {
              accessUserId: accessUser.id,
            },
          );
        }),
      );

    if (searchKeyword) {
      diariesByUsername
        .where(`${tableAliasInfo.diaryAuthor}.username ILIKE :searchKeyword`, {
          searchKeyword: `%${searchKeyword}%`,
        })
        .orWhere(`${tableAliasInfo.diary}.title ILIKE :searchKeyword`, {
          searchKeyword: `%${searchKeyword}%`,
        })
        .orWhere(`${tableAliasInfo.diary}.content ILIKE :searchKeyword`, {
          searchKeyword: `%${searchKeyword}%`,
        });
    }

    if (sortByConverter[sortBy] === undefined)
      throw new BadRequestException(diaryExceptionMessage.INVALID_SORT_BY);

    const [diaries, totalCount] = await diariesByUsername
      .orderBy(`${tableAliasInfo.diary}.${sortByConverter[sortBy]}`, 'DESC')
      .take(take)
      .skip(skip)
      .getManyAndCount();

    const resultDiaries = diaries.map((diary) => {
      return generateCustomFieldForDiary(diary, accessUser.id);
    });

    return {
      diaries: resultDiaries,
      totalCount,
      totalPage: Math.ceil(totalCount / take),
    };
  }

  async create(diaryFormDto: DiaryFormDTO, author: UserDTO) {
    const newDiary = this.diaryRepository.create({
      author,
      ...diaryFormDto,
    });

    await this.diaryRepository.save(newDiary);

    const writeCount = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoin('diary.author', 'author')
      .where('author.id = :authorId', { authorId: author.id })
      .getCount();

    // 뱃지 획득 조건을 추가하고 싶은 경우 /src/constants/badgeAcquisitionCondition.ts에 추가
    const badgeToGet = await this.userToBadgesService.achievedBadge(
      author,
      writeCount,
      BadgeAcquisitionConditionForDiary,
    );

    return {
      diary: newDiary,
      badge: badgeToGet,
    };
  }

  async update(id: string, diaryFormDto: DiaryFormDTO, accessUser: UserDTO) {
    const targetDiary = await this.getOne(id, accessUser);
    const writer = targetDiary.author;

    if (writer.id !== accessUser.id) {
      throw new UnauthorizedException(diaryExceptionMessage.OWNER_ONLY_EDIT);
    }

    await this.diaryRepository.update(id, {
      ...diaryFormDto,
      author: accessUser,
    });

    return this.getOne(id, accessUser);
  }

  async delete(id: string, accessUser: UserDTO) {
    const targetDiary = await this.getOne(id, accessUser);
    const writer = targetDiary.author;

    if (writer.id !== accessUser.id) {
      throw new UnauthorizedException(diaryExceptionMessage.OWNER_ONLY_DELETE);
    }

    await this.diaryRepository.softDelete(id);

    return { message: '삭제되었습니다.' };
  }
}
