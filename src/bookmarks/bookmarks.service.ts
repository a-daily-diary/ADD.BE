import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  bookmarkExceptionMessage,
  diaryExceptionMessage,
} from 'src/constants/exceptionMessage';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { UserDTO } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';
import { BookmarkEntity } from './bookmarks.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private readonly bookmarkRepository: Repository<BookmarkEntity>,
    @InjectRepository(DiaryEntity)
    private readonly diaryRepository: Repository<DiaryEntity>,
  ) {}

  async findDiaryById(id: string) {
    const diary = await this.diaryRepository.findOneBy({ id });

    if (!diary) {
      throw new NotFoundException(diaryExceptionMessage.DOES_NOT_EXIST_DIARY);
    }

    return diary;
  }

  async getAll() {
    return await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .leftJoinAndSelect('bookmark.author', 'author')
      .leftJoinAndSelect('bookmark.diary', 'diary')
      .getMany();
  }

  async create(diaryId: string, user: UserDTO) {
    const targetDiary = await this.findDiaryById(diaryId);

    const registerHistoryAtBookmark = await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .leftJoin('bookmark.diary', 'diary')
      .leftJoin('bookmark.author', 'author')
      .where('author.id = :author_id', { author_id: user.id })
      .andWhere('diary.id = :diary_id', { diary_id: diaryId })
      .getOne();

    if (registerHistoryAtBookmark) {
      throw new BadRequestException(bookmarkExceptionMessage.ONLY_ONE_BOOKMARK);
    }

    const newBookmark = await this.bookmarkRepository.create({
      author: user,
      diary: targetDiary,
    });

    return await this.bookmarkRepository.save(newBookmark);
  }

  async delete(diaryId: string, user: UserDTO) {
    const targetDiary = await this.findDiaryById(diaryId);

    const registerHistoryAtBookmark = await this.bookmarkRepository
      .createQueryBuilder('bookmark')
      .leftJoin('bookmark.diary', 'diary')
      .leftJoin('bookmark.author', 'author')
      .where({ author: user, diary: targetDiary })
      .getOne();

    if (!registerHistoryAtBookmark) {
      throw new BadRequestException(
        bookmarkExceptionMessage.DOES_NOT_REGISTER_BOOKMARK,
      );
    }

    await this.bookmarkRepository.delete(registerHistoryAtBookmark.id);

    return { message: '취소 되었습니다.' };
  }

  async allDelete() {
    const bookmarks = await this.bookmarkRepository.find();

    bookmarks.forEach(async (bookmark) => {
      await this.bookmarkRepository.delete(bookmark.id);
    });
  }
}
