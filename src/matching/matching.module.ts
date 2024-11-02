import { Module } from '@nestjs/common';
import { MatchingGateway } from './matching.gateway';
import { MatchingHistoriesModule } from 'src/matching-histories/matching-histories.module';

@Module({
  imports: [MatchingHistoriesModule],
  providers: [MatchingGateway],
})
export class MatchingModule {}
