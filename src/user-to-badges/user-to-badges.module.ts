import { Module } from '@nestjs/common';
import { UserToBadgesService } from './user-to-badges.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToBadgeEntity } from './user-to-badges.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserToBadgeEntity])],
  providers: [UserToBadgesService],
})
export class UserToBadgesModule {}
