import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackEntity } from './feedback.entity';
import { UsersModule } from 'src/users/users.module';
import { MatchingHistoriesModule } from 'src/matching-histories/matching-histories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackEntity]),
    UsersModule,
    MatchingHistoriesModule,
  ],
  providers: [FeedbackService],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
