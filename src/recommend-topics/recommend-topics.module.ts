import { Module } from '@nestjs/common';
import { RecommendTopicsService } from './recommend-topics.service';
import { RecommendTopicsController } from './recommend-topics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendTopicEntity } from './recommend-topics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecommendTopicEntity])],
  providers: [RecommendTopicsService],
  controllers: [RecommendTopicsController],
})
export class RecommendTopicsModule {}
