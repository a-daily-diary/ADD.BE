import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      throw new BadRequestException('존재하지 않는 게시물입니다.');
    }

    if (
      targetDiary.favorites
        .map((favorite) => favorite.author.id)
        .includes(accessUser.id)
    ) {
      throw new BadRequestException(
        '접근한 계정은 해당 게시물에 좋아요가 등록되어있습니다.',
      );
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
      throw new BadRequestException('존재하지 않는 게시물입니다.');
    }

    if (!targetFavoriteInstance) {
      throw new BadRequestException(
        '접근한 계정으로 해당 게시물에 좋아요가 등록 되어있지 않아 좋아요 취소가 불가능합니다.',
      );
    }

    targetDiary.favoriteCount -= 1;

    this.diaryRepository.save(targetDiary);
    await this.favoriteRepository.delete(targetFavoriteInstance.id);

    return { message: '취소 되었습니다.' };
  }
}
