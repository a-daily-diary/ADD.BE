import { Module } from '@nestjs/common';
import { MatchingRulesController } from './matching-rules.controller';

@Module({
  controllers: [MatchingRulesController],
})
export class MatchingRulesModule {}
