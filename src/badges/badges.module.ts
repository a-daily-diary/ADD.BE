import { Module, forwardRef } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadgeEntity } from './badges.entity';
import { AwsService } from 'src/aws.service';
import { UsersModule } from 'src/users/users.module';
import { UserToBadgesModule } from 'src/user-to-badges/user-to-badges.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BadgeEntity]),
    UsersModule,
    forwardRef(() => UserToBadgesModule),
  ],
  providers: [BadgesService, AwsService],
  controllers: [BadgesController],
  exports: [BadgesService],
})
export class BadgesModule {}
