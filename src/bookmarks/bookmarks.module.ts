import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { DiariesModule } from 'src/diaries/diaries.module';
import { BookmarkEntity } from './bookmarks.entity';
import { BookmarksService } from './bookmarks.service';
import { BadgesModule } from 'src/badges/badges.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookmarkEntity, DiaryEntity]),
    forwardRef(() => DiariesModule),
    BadgesModule,
  ],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule {}
