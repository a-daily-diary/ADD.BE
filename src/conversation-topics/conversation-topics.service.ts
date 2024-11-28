import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationTopicEntity } from './conversation-topics.entity';
import { Repository } from 'typeorm';
import { ConversationTopicFormDTO } from './dto/conversation-topic-form.dto';

@Injectable()
export class ConversationTopicsService {
  constructor(
    @InjectRepository(ConversationTopicEntity)
    private readonly topicRepository: Repository<ConversationTopicEntity>,
  ) {}

  async create(topicFormDTO: ConversationTopicFormDTO) {
    const newTopic = this.topicRepository.create(topicFormDTO);

    await this.topicRepository.save(newTopic);

    return newTopic;
  }
}
