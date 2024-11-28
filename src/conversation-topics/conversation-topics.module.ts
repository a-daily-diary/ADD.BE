import { Module } from '@nestjs/common';
import { ConversationTopicsService } from './conversation-topics.service';
import { ConversationTopicsController } from './conversation-topics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationTopicEntity } from './conversation-topics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationTopicEntity])],
  providers: [ConversationTopicsService],
  controllers: [ConversationTopicsController],
})
export class ConversationTopicsModule {}
