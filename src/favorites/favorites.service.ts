import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { favoriteExceptionMessage } from 'src/constants/exceptionMessage';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { UserDTO } from 'src/users/dto/user.dto';
import { FavoriteEntity } from './favorites.entity';
import { BadgeCode } from 'src/types/badges.type';
import { UserToBadgesService } from 'src/user-to-badges/user-to-badges.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoriteRepository: Repository<FavoriteEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository: Repository<DiaryEntity>,
    private readonly userToBadgesService: UserToBadgesService,
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

    const registerFavoriteCount = await this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoin('favorite.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getCount();

    const badgeToGet = await this.achievedBadge(user, registerFavoriteCount);

    return { message: '좋아요가 등록되었습니다.', badge: badgeToGet };
  }

  // FIXME: 이미 획득한 경우 예외 처리
  // FIXME: 획득 조건 상수 혹은 함수로 분리
  private async achievedBadge(user: UserDTO, conditionCount: number) {
    switch (conditionCount) {
      case 10:
        return await this.userToBadgesService.saveUserToBadge(
          user,
          BadgeCode.heart,
        );
      default:
        return null;
    }
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
