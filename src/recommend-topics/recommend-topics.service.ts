import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecommendTopicEntity } from './recommend-topics.entity';
import { Repository } from 'typeorm';
import { RecommendTopicFormDTO } from './dto/recommend-topic-form.dto';
import { DEFAULT_SKIP, DEFAULT_TAKE } from 'src/constants/page';
import { recommendTopicExceptionMessage } from 'src/constants/exceptionMessage';

@Injectable()
export class RecommendTopicsService {
  constructor(
    @InjectRepository(RecommendTopicEntity)
    private readonly topicRepository: Repository<RecommendTopicEntity>,
  ) {}

  async create(topicFormDTO: RecommendTopicFormDTO) {
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

  async getRandomTopic() {
    const topics = await this.getList(100, 0);

    if (topics.totalCount === 0)
      throw new BadRequestException(
        recommendTopicExceptionMessage.EMPTY_TOPIC_LIST,
      );

    const randomIndex = Math.floor(Math.random() * topics.totalCount);

    return topics.list[randomIndex];
  }

  async findById(id: string) {
    const topic = await this.topicRepository.findOneBy({ id });

    if (!topic)
      throw new NotFoundException(
        recommendTopicExceptionMessage.DOES_NOT_EXIST_TOPIC,
      );

    return topic;
  }

  async update(id: string, topicFormDTO: RecommendTopicFormDTO) {
    await this.findById(id);

    await this.topicRepository.update(id, topicFormDTO);

    return this.findById(id);
  }

  async delete(id: string) {
    await this.findById(id);

    await this.topicRepository.delete(id);

    return { message: '삭제되었습니다.' };
  }
}
