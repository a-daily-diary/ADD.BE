import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  generateCustomFieldForDiary(diary: DiaryEntity, accessUserId: string) {
    const { author, favorites, deleteAt, ...otherInfo } = diary; // FIXME: nest의 classSerializerInterceptor로 처리할 수 있는 방법 고안하기

    const isFavorite = favorites
      .map((favorite) => favorite.author.id)
      .includes(accessUserId);

    return {
      ...otherInfo,
      isFavorite,
      isBookmark: false,
      author,
    };
  }

  async getAll(accessUser: UserDTO) {
    const diaries = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .leftJoinAndSelect('diary.favorites', 'favorites')
      .leftJoinAndSelect('favorites.author', 'favoriteAuthor')
      .getMany();

    const responseDiaries = diaries.map((diary) =>
      this.generateCustomFieldForDiary(diary, accessUser.id),
    );

    return responseDiaries;
  }

  async getOne(id: string, accessUser: UserDTO) {
    const diary = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .leftJoinAndSelect('diary.favorites', 'favorites')
      .leftJoinAndSelect('favorites.author', 'favoriteAuthor')
      .where('diary.id = :id', { id })
      .getOne();

    return this.generateCustomFieldForDiary(diary, accessUser.id);
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
