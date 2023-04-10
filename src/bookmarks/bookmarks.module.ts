import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { DiariesModule } from 'src/diaries/diaries.module';
import { BookmarkEntity } from './bookmarks.entity';
import { BookmarksService } from './bookmarks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookmarkEntity, DiaryEntity]),
    forwardRef(() => DiariesModule),
  ],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule {}
