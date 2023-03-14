import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksModule } from 'src/bookmarks/bookmarks.module';
import { AwsService } from 'src/aws.service';
import { FavoritesModule } from 'src/favorities/favorites.module';
import { DiariesController } from './diaries.controller';
import { DiaryEntity } from './diaries.entity';
import { DiariesService } from './diaries.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntity]),
    FavoritesModule,
    BookmarksModule,
  ],
  controllers: [DiariesController],
  providers: [DiariesService, AwsService],
})
export class DiariesModule {}
