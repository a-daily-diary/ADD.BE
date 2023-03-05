import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { diaryExceptionMessage } from 'src/constants/exceptionMessage';
import { DiaryEntity } from 'src/diaries/diaries.entity';
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

  async allDelete() {
    const bookmarks = await this.bookmarkRepository.find();

    bookmarks.forEach(async (bookmark) => {
      await this.bookmarkRepository.delete(bookmark.id);
    });
  }
}
