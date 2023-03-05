import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { bookmarkExceptionMessage } from 'src/constants/exceptionMessage';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { DiariesService } from 'src/diaries/diaries.service';
import { UserDTO } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import { BookmarkEntity } from './bookmarks.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private readonly bookmarkRepository: Repository<BookmarkEntity>,
    private readonly diariesSerivce: DiariesService,
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

    return await this.bookmarkRepository.save(newBookmark);
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

    return { message: '취소 되었습니다.' };
  }
}
