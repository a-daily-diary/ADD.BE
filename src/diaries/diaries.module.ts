import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksModule } from 'src/bookmarks/bookmarks.module';
import { AwsService } from 'src/aws.service';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { DiariesController } from './diaries.controller';
import { DiaryEntity } from './diaries.entity';
import { DiariesService } from './diaries.service';
import { CommentsModule } from 'src/comments/comments.module';
import { UserToBadgesModule } from 'src/user-to-badges/user-to-badges.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntity]),
    FavoritesModule,
    BookmarksModule,
    CommentsModule,
    UserToBadgesModule,
  ],
  controllers: [DiariesController],
  providers: [DiariesService, AwsService],
  exports: [DiariesService],
})
export class DiariesModule {}
