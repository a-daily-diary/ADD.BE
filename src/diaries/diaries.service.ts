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

  async findOneById(id: string) {
    const diary = await this.diaryRepository.findOneBy({ id });

    if (!diary) {
      throw new NotFoundException(diaryExceptionMessage.DOES_NOT_EXIST_DIARY);
    }

    return diary;
  }

  async uploadImg(file: Express.Multer.File) {
    const uploadInfo = await this.awsService.uploadFileToS3('diaries', file);
    return { imgUrl: this.awsService.getAwsS3FileUrl(uploadInfo.key) };
  }

  generateCustomFieldForDiary(diary: DiaryEntity, accessUserId: string) {
    const { author, favorites, bookmarks, deleteAt, ...otherInfo } = diary; // FIXME: nest의 classSerializerInterceptor로 처리할 수 있는 방법 고안하기

    const isFavorite = favorites
      .map((favorite) => favorite.author.id)
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
    const aliasInfo = {
      diary: 'diary',
      diaryAuthor: 'author',
      diaryFavorites: 'favorites',
      favoritesAuthor: 'favoriteAuthor',
      diaryBookmarks: 'bookmarks',
      bookmarksUser: 'bookmarkUser',
    };

    const selectDiaryInstance = this.diaryRepository
      .createQueryBuilder(aliasInfo.diary)
      .leftJoinAndSelect('diary.author', aliasInfo.diaryAuthor)
      .leftJoinAndSelect('diary.favorites', aliasInfo.diaryFavorites)
      .leftJoinAndSelect('favorites.author', aliasInfo.favoritesAuthor)
      .leftJoinAndSelect('diary.bookmarks', aliasInfo.diaryBookmarks)
      .leftJoinAndSelect('bookmarks.user', aliasInfo.bookmarksUser);

    return { selectDiaryInstance, aliasInfo };
  }

  async getAll(accessUser: UserDTO) {
    const { selectDiaryInstance } = this.generateSelectDiaryInstance();

    const diaries = await selectDiaryInstance.getMany();

    const responseDiaries = diaries.map((diary) => {
      return this.generateCustomFieldForDiary(diary, accessUser.id);
    });

    return responseDiaries;
  }

  async getOne(id: string, accessUser: UserDTO) {
    const { selectDiaryInstance, aliasInfo } =
      await this.generateSelectDiaryInstance();

    const diaryByDiaryId = await selectDiaryInstance
      .where(`${aliasInfo.diary}.id = :id`, { id })
      .getOne();

    if (!diaryByDiaryId) {
      throw new NotFoundException(diaryExceptionMessage.DOES_NOT_EXIST_DIARY);
    }
    return this.generateCustomFieldForDiary(diaryByDiaryId, accessUser.id);
  }

  async getDiariesByUsersBookmark(username: string, accessUser: UserDTO) {
    const { selectDiaryInstance, aliasInfo } =
      this.generateSelectDiaryInstance();

    const diariesByUsername = await selectDiaryInstance
      .where(`${aliasInfo.bookmarksUser}.username = :username`, {
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
