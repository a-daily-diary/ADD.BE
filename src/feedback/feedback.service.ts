import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackEntity } from './feedback.entity';
import { Repository } from 'typeorm';
import { UserDTO } from 'src/users/dto/user.dto';
import { FeedbackFormDTO } from './dto/feedback-form.dto';
import { UsersService } from 'src/users/users.service';
import { MatchingHistoriesService } from 'src/matching-histories/matching-histories.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
    private readonly usersService: UsersService,
    private readonly matchingHistoriesService: MatchingHistoriesService,
  ) {}

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
}
