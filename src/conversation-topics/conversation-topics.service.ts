import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationTopicEntity } from './conversation-topics.entity';
import { Repository } from 'typeorm';
import { ConversationTopicFormDTO } from './dto/conversation-topic-form.dto';
import { DEFAULT_SKIP, DEFAULT_TAKE } from 'src/constants/page';

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

  async getList(take = DEFAULT_TAKE, skip = DEFAULT_SKIP) {
    const [topics, totalCount] = await this.topicRepository
      .createQueryBuilder('topic')
      .orderBy('topic.createdAt', 'DESC')
      .take(take)
      .skip(skip)
      .getManyAndCount();

    return { list: topics, totalCount };
  }
}
