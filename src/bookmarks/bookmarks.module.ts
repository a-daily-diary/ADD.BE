import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { BookmarkEntity } from './bookmarks.entity';
import { BookmarksService } from './bookmarks.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkEntity, DiaryEntity])],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule {}
