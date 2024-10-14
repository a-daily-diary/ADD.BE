import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { CommentEntity } from 'src/comments/comments.entity';
import { MatchingHistoryEntity } from 'src/matching-histories/matching-histories.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiaryEntity,
      CommentEntity,
      MatchingHistoryEntity,
    ]),
  ],
  providers: [ActivitiesService],
  controllers: [ActivitiesController],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
