import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingHistoryEntity } from './matching-histories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchingHistoryEntity])],
})
export class MatchingHistoriesModule {}
