import { Module } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToBadgeEntity } from 'src/users/userToBadge.entity';
import { BadgeEntity } from './badges.entity';
import { AwsService } from 'src/aws.service';

@Module({
  imports: [TypeOrmModule.forFeature([BadgeEntity, UserToBadgeEntity])],
  providers: [BadgesService, AwsService],
  controllers: [BadgesController],
})
export class BadgesModule {}
