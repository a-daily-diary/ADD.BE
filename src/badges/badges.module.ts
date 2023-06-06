import { Module } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadgeEntity } from './badges.entity';
import { AwsService } from 'src/aws.service';
import { UserToBadgeEntity } from 'src/user-to-badges/user-to-badges.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BadgeEntity, UserToBadgeEntity]),
    UsersModule,
  ],
  providers: [BadgesService, AwsService],
  controllers: [BadgesController],
  exports: [BadgesService],
})
export class BadgesModule {}
