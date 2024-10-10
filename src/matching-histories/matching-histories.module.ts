import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingHistoryEntity } from './matching-histories.entity';
import { MatchingHistoriesController } from './matching-histories.controller';
import { MatchingHistoriesService } from './matching-histories.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([MatchingHistoryEntity]), UsersModule],
  controllers: [MatchingHistoriesController],
  providers: [MatchingHistoriesService],
  exports: [MatchingHistoriesService],
})
export class MatchingHistoriesModule {}
