import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { CommentEntity } from './comments.entity';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity, DiaryEntity])],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
