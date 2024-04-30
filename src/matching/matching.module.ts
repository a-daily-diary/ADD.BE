import { Module } from '@nestjs/common';
import { MatchingGateway } from './matching.gateway';

@Module({
  providers: [MatchingGateway],
})
export class MatchingModule {}
