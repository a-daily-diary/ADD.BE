import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { CommentEntity } from './comments.entity';
import { CommentsService } from './comments.service';
import { BadgesModule } from 'src/badges/badges.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, DiaryEntity]),
    BadgesModule,
  ],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
