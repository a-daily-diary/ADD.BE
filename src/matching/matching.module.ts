import { Module } from '@nestjs/common';
import { MatchingGateway } from './matching.gateway';
import { MatchingHistoriesModule } from 'src/matching-histories/matching-histories.module';
import { BlacklistsModule } from 'src/blacklists/blacklists.module';

@Module({
  imports: [MatchingHistoriesModule, BlacklistsModule],
  providers: [MatchingGateway],
})
export class MatchingModule {}
