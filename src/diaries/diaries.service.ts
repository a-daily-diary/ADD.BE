import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws.service';
import { diaryExceptionMessage } from 'src/constants/exceptionMessage';
import { UserDTO } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import { DiaryEntity } from './diaries.entity';
import { DiaryFormDTO } from './dto/diary-form.dto';

@Injectable()
export class DiariesService {
  constructor(
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository: Repository<DiaryEntity>,
    private readonly awsService: AwsService,
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

  generateCustomFieldForDiary(diary: DiaryEntity, accessUserId: string) {
    const { author, favorites, bookmarks, deleteAt: _, ...otherInfo } = diary; // FIXME: nest의 classSerializerInterceptor로 처리할 수 있는 방법 고안하기

    const isFavorite = favorites
      .map((favorite) => favorite.user.id)
      .includes(accessUserId);

    const isBookmark = bookmarks
      .map((bookmark) => bookmark.user.id)
      .includes(accessUserId);

    return {
      ...otherInfo,
      isFavorite,
      isBookmark,
      author,
    };
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
    diaryAuthorName?: string,
    take?: number | typeof NaN,
    skip?: number | typeof NaN,
  ) {
    const defaultTake = 10;
    const defaultSkip = 0;

    const { selectDiaryInstance, tableAliasInfo } =
      this.generateSelectDiaryInstance();

    const [diaries, totalCount] = !diaryAuthorName
      ? await selectDiaryInstance
          .take(take ?? defaultTake)
          .skip(skip ?? defaultSkip)
          .getManyAndCount()
      : await selectDiaryInstance
          .where(`${tableAliasInfo.diaryAuthor}.username = :username`, {
            username: diaryAuthorName,
          })
          .take(take ?? defaultTake)
          .skip(skip ?? defaultSkip)
          .getManyAndCount();

    const resultDiaries = diaries.map((diary) => {
      return this.generateCustomFieldForDiary(diary, accessUser.id);
    });

    return {
      diaries: resultDiaries,
      totalCount,
      totalPage: Math.ceil(totalCount / (take ?? defaultTake)),
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
    return this.generateCustomFieldForDiary(diaryByDiaryId, accessUser.id);
  }

  async getDiariesByUsersBookmark(username: string, accessUser: UserDTO) {
    const { selectDiaryInstance, tableAliasInfo } =
      this.generateSelectDiaryInstance();

    const diariesByUsername = await selectDiaryInstance
      .where(`${tableAliasInfo.bookmarksUser}.username = :username`, {
        username,
      })
      .getMany();

    const responseDiariesByUsername = diariesByUsername.map((diary) => {
      return this.generateCustomFieldForDiary(diary, accessUser.id);
    });

    return responseDiariesByUsername;
  }

  async create(diaryFormDto: DiaryFormDTO, author: UserDTO) {
    const { title, content, imgUrl } = diaryFormDto;
    const newDiary = await this.diaryRepository.create({
      title,
      content,
      imgUrl,
      author,
    });

    return await this.diaryRepository.save(newDiary);
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
