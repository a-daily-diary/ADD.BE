import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackEntity } from './feedback.entity';
import { Repository } from 'typeorm';
import { UserDTO } from 'src/users/dto/user.dto';
import { FeedbackFormDTO } from './dto/feedback-form.dto';
import { UsersService } from 'src/users/users.service';
import { MatchingHistoriesService } from 'src/matching-histories/matching-histories.service';
import { DEFAULT_SKIP, DEFAULT_TAKE } from 'src/constants/page';
import { feedbackExceptionMessage } from 'src/constants/exceptionMessage';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
    private readonly usersService: UsersService,
    private readonly matchingHistoriesService: MatchingHistoriesService,
  ) {}

  async findOneById(id: string) {
    const feedback = await this.feedbackRepository.findOneBy({ id });

    if (!feedback)
      throw new NotFoundException(
        feedbackExceptionMessage.DOES_NOT_EXIST_FEEDBACK,
      );

    return feedback;
  }

  async create(
    writer: UserDTO,
    matchingHistoryId: string,
    feedbackFormDTO: FeedbackFormDTO,
  ) {
    const { matchedUserId, ...feedbackForm } = feedbackFormDTO;

    const recipient = await this.usersService.findUserById(matchedUserId);
    const matchingHistory = await this.matchingHistoriesService.findOneById(
      matchingHistoryId,
    );

    const newFeedback = this.feedbackRepository.create({
      matchingHistory,
      writer,
      recipient,
      ...feedbackForm,
    });

    await this.feedbackRepository.save(newFeedback);

    return newFeedback;
  }

  async getFeedbackList(
    take = DEFAULT_TAKE,
    skip = DEFAULT_SKIP,
    recipient?: string,
    date?: Date,
  ) {
    const feedbackQueryBuilder = this.feedbackRepository
      .createQueryBuilder('feedback')
      .leftJoin('feedback.recipient', 'recipient');

    if (recipient) {
      feedbackQueryBuilder.where('recipient.username = :username', {
        username: recipient,
      });
    }

    if (date) {
      feedbackQueryBuilder.andWhere('DATE(feedback.createdAt) = :date', {
        date,
      });
    }

    const [feedbackList, totalCount] = await feedbackQueryBuilder
      .take(take)
      .skip(skip)
      .getManyAndCount();

    return {
      feedbackList,
      totalCount,
    };
  }

  async delete(id: string) {
    await this.findOneById(id);

    await this.feedbackRepository.softDelete(id);

    return { message: '삭제되었습니다.' };
  }
}
