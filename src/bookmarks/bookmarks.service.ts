import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { bookmarkExceptionMessage } from 'src/constants/exceptionMessage';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { DiariesService } from 'src/diaries/diaries.service';
import { UserDTO } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import { BookmarkEntity } from './bookmarks.entity';
import { BadgeEntity } from 'src/badges/badges.entity';
import { BadgesService } from 'src/badges/badges.service';
import { BadgeCode } from 'src/types/badges.type';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private readonly bookmarkRepository: Repository<BookmarkEntity>,
    private readonly diariesSerivce: DiariesService,
    private readonly badgesService: BadgesService,
  ) {}

  async findBookmarkByUserAndDiary(user: UserDTO, diary: DiaryEntity) {
    return await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .leftJoin('bookmark.user', 'user')
      .leftJoin('bookmark.diary', 'diary')
      .where({ user, diary })
      .getOne();
  }

  async register(diaryId: string, user: UserDTO) {
    const targetDiary = await this.diariesSerivce.findOneById(diaryId);
    const bookmarkByUserAndDiary = await this.findBookmarkByUserAndDiary(
      user,
      targetDiary,
    );

    if (bookmarkByUserAndDiary) {
      throw new BadRequestException(bookmarkExceptionMessage.ONLY_ONE_BOOKMARK);
    }

    const newBookmark = await this.bookmarkRepository.create({
      user,
      diary: targetDiary,
    });

    await this.bookmarkRepository.save(newBookmark);

    const registerBookmarkCount = await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .leftJoin('bookmark.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getCount();

    let badgeToGet: BadgeEntity;

    // FIXME: 이미 획득한 경우 예외 처리
    // FIXME: 획득 조건 상수 혹은 함수로 분리
    if (registerBookmarkCount === 10) {
      badgeToGet = await this.badgesService.findById(BadgeCode.bookmark);
    }

    return { message: '북마크가 등록되었습니다.', badge: badgeToGet || null };
  }

  async unregister(diaryId: string, user: UserDTO) {
    const targetDiary = await this.diariesSerivce.findOneById(diaryId);
    const bookmarkByUserAndDiary = await this.findBookmarkByUserAndDiary(
      user,
      targetDiary,
    );

    if (!bookmarkByUserAndDiary) {
      throw new BadRequestException(
        bookmarkExceptionMessage.DOES_NOT_REGISTER_BOOKMARK,
      );
    }

    await this.bookmarkRepository.delete(bookmarkByUserAndDiary.id);

    return { message: '북마크 등록이 취소되었습니다.' };
  }
}
