import { Module } from '@nestjs/common';
import { HeatmapService } from './heatmap.service';
import { HeatmapController } from './heatmap.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { CommentEntity } from 'src/comments/comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity, CommentEntity])],
  providers: [HeatmapService],
  controllers: [HeatmapController],
  exports: [HeatmapService],
})
export class HeatmapModule {}
