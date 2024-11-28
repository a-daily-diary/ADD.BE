import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationTopicEntity } from './conversation-topics.entity';
import { Repository } from 'typeorm';
import { ConversationTopicFormDTO } from './dto/conversation-topic-form.dto';
import { DEFAULT_SKIP, DEFAULT_TAKE } from 'src/constants/page';
import { conversationTopicExceptionMessage } from 'src/constants/exceptionMessage';

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

  async findById(id: string) {
    const topic = await this.topicRepository.findOneBy({ id });

    if (!topic)
      throw new NotFoundException(
        conversationTopicExceptionMessage.DOES_NOT_EXIST_TOPIC,
      );

    return topic;
  }

  async update(id: string, topicFormDTO: ConversationTopicFormDTO) {
    await this.findById(id);

    await this.topicRepository.update(id, topicFormDTO);

    return this.findById(id);
  }
}
