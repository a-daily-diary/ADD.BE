import { Module } from '@nestjs/common';
import { UserToBadgesService } from './user-to-badges.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToBadgeEntity } from './user-to-badges.entity';
import { BadgesModule } from 'src/badges/badges.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserToBadgeEntity]), BadgesModule],
  providers: [UserToBadgesService],
  exports: [UserToBadgesService],
})
export class UserToBadgesModule {}
