import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchingHistoryFormDTO } from './dto/matching-history-form.dto';
import { UserDTO } from 'src/users/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchingHistoryEntity } from './matching-histories.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { DEFAULT_SKIP, DEFAULT_TAKE } from 'src/constants/page';
import { matchingHistoryExceptionMessage } from 'src/constants/exceptionMessage';

@Injectable()
export class MatchingHistoriesService {
  constructor(
    @InjectRepository(MatchingHistoryEntity)
    private readonly matchingHistoryRepository: Repository<MatchingHistoryEntity>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    matchingHistoryForm: MatchingHistoryFormDTO,
    currentUser: UserDTO,
  ) {
    const { matchedUserId, matchTime } = matchingHistoryForm;

    const matchedUser = await this.usersService.findUserById(matchedUserId);

    const newMatchingHistory = this.matchingHistoryRepository.create({
      user: currentUser,
      matchedUser,
      matchTime,
    });

    await this.matchingHistoryRepository.save(newMatchingHistory);

    return newMatchingHistory;
  }

  async getMatchingHistories(take = DEFAULT_TAKE, skip = DEFAULT_SKIP) {
    const matchingHistories = await this.matchingHistoryRepository
      .createQueryBuilder('matchingHistory')
      .leftJoinAndSelect('matchingHistory.user', 'user')
      .leftJoinAndSelect('matchingHistory.matchedUser', 'matchedUser')
      .orderBy('matchingHistory.createdAt', 'DESC')
      .take(take)
      .skip(skip)
      .getManyAndCount();

    return matchingHistories;
  }

  async delete(historyId: string) {
    const targetMatchingHistory =
      await this.matchingHistoryRepository.findOneBy({
        id: historyId,
      });

    if (!targetMatchingHistory) {
      throw new NotFoundException(
        matchingHistoryExceptionMessage.DOES_NOT_EXIST_MATCHING_HISTORY,
      );
    }

    await this.matchingHistoryRepository.softDelete(historyId);

    return { message: '삭제되었습니다.' };
  }
}
