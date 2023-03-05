import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { favoriteExceptionMessage } from 'src/constants/exceptionMessage';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { UserDTO } from 'src/users/dto/user.dto';
import { FavoriteEntity } from './favorites.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoriteRepository: Repository<FavoriteEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository: Repository<DiaryEntity>,
  ) {}

  async create(diaryId: string, accessUser: UserDTO) {
    const targetDiary = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.favorites', 'favorites')
      .leftJoinAndSelect('favorites.author', 'author')
      .where({ id: diaryId })
      .getOne();

    if (!targetDiary) {
      throw new BadRequestException(
        favoriteExceptionMessage.DOES_NOT_EXIST_DIARY,
      );
    }

    if (
      targetDiary.favorites
        .map((favorite) => favorite.author.id)
        .includes(accessUser.id)
    ) {
      throw new BadRequestException(favoriteExceptionMessage.ONLY_ONE_FAVORITE);
    }

    targetDiary.favoriteCount += 1;
    const newFavorite = await this.favoriteRepository.create({
      author: accessUser,
      diary: targetDiary,
    });

    await this.diaryRepository.save(targetDiary);
    await this.favoriteRepository.save(newFavorite);

    delete newFavorite.diary.favorites;

    return newFavorite;
  }

  async delete(diaryId: string, accessUser: UserDTO) {
    const targetDiary = await this.diaryRepository.findOneBy({ id: diaryId });
    const targetFavoriteInstance = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoin('favorite.author', 'author')
      .leftJoin('favorite.diary', 'diary')
      .where({ author: accessUser, diary: targetDiary })
      .getOne();

    if (!targetDiary) {
      throw new BadRequestException(
        favoriteExceptionMessage.DOES_NOT_EXIST_DIARY,
      );
    }

    if (!targetFavoriteInstance) {
      throw new BadRequestException(
        favoriteExceptionMessage.DOES_NOT_REGISTER_FAVORITE,
      );
    }

    targetDiary.favoriteCount -= 1;

    this.diaryRepository.save(targetDiary);
    await this.favoriteRepository.delete(targetFavoriteInstance.id);

    return { message: '취소 되었습니다.' };
  }
}
