import { Module } from '@nestjs/common';
import { UserToBadgesService } from './user-to-badges.service';

@Module({
  providers: [UserToBadgesService],
})
export class UserToBadgesModule {}
