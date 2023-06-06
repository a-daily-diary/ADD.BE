import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { CommentEntity } from './comments.entity';
import { CommentsService } from './comments.service';
import { UserToBadgesModule } from 'src/user-to-badges/user-to-badges.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, DiaryEntity]),
    UserToBadgesModule,
  ],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
