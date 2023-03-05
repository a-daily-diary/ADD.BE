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

  async getAll() {
    return await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .leftJoinAndSelect('bookmark.author', 'author')
      .leftJoinAndSelect('bookmark.diary', 'diary')
      .getMany();
  }

  async findBookmarkByUserAndDiary(user: UserDTO, diary: DiaryEntity) {
    return await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .leftJoin('bookmark.author', 'author')
      .leftJoin('bookmark.diary', 'diary')
      .where({ author: user, diary })
      .getOne();
  }

  async create(diaryId: string, user: UserDTO) {
    const targetDiary = await this.diariesSerivce.findOneById(diaryId);
    const bookmarkByUserAndDiary = await this.findBookmarkByUserAndDiary(
      user,
      targetDiary,
    );

    if (bookmarkByUserAndDiary) {
      throw new BadRequestException(bookmarkExceptionMessage.ONLY_ONE_BOOKMARK);
    }

    const newBookmark = await this.bookmarkRepository.create({
      author: user,
      diary: targetDiary,
    });

    return await this.bookmarkRepository.save(newBookmark);
  }

  async delete(diaryId: string, user: UserDTO) {
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

  async allDelete() {
    const bookmarks = await this.bookmarkRepository.find();

    bookmarks.forEach(async (bookmark) => {
      await this.bookmarkRepository.delete(bookmark.id);
    });
  }
}
