import { Module } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadgeEntity } from './badges.entity';
import { AwsService } from 'src/aws.service';
import { UserToBadgeEntity } from 'src/user-to-badges/user-to-badges.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BadgeEntity, UserToBadgeEntity])],
  providers: [BadgesService, AwsService],
  controllers: [BadgesController],
})
export class BadgesModule {}
