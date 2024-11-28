import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationTopicEntity } from './conversation-topics.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationTopicsService {
  constructor(
    @InjectRepository(ConversationTopicEntity)
    private readonly topicRepository: Repository<ConversationTopicEntity>,
  ) {}
}
