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

  async register(diaryId: string, user: UserDTO) {
    const targetDiary = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.favorites', 'favorites')
      .leftJoinAndSelect('favorites.user', 'user')
      .where({ id: diaryId })
      .getOne();

    if (!targetDiary) {
      throw new BadRequestException(
        favoriteExceptionMessage.DOES_NOT_EXIST_DIARY,
      );
    }

    if (
      targetDiary.favorites
        .map((favorite) => favorite.user.id)
        .includes(user.id)
    ) {
      throw new BadRequestException(favoriteExceptionMessage.ONLY_ONE_FAVORITE);
    }

    targetDiary.favoriteCount += 1;
    const newFavorite = await this.favoriteRepository.create({
      user,
      diary: targetDiary,
    });

    await this.diaryRepository.save(targetDiary);
    await this.favoriteRepository.save(newFavorite);

    return { message: '좋아요가 등록되었습니다.' };
  }

  async unregister(diaryId: string, user: UserDTO) {
    const targetDiary = await this.diaryRepository.findOneBy({ id: diaryId });
    const targetFavoriteInstance = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoin('favorite.user', 'user')
      .leftJoin('favorite.diary', 'diary')
      .where({ user, diary: targetDiary })
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

    return { message: '좋아요 등록이 취소되었습니다.' };
  }
}
