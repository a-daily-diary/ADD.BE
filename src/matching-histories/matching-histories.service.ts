import { Injectable, NotFoundException } from '@nestjs/common';
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

  // 매칭이 종료되는 경우(socket이 끊기는 경우) offer 사용자가 이력을 생성합니다.
  async create(offerUserId: string, answerUserId: string, matchTime = 0) {
    const offerUser = await this.usersService.findUserById(offerUserId);
    const answerUser = await this.usersService.findUserById(answerUserId);

    const newMatchingHistory = this.matchingHistoryRepository.create({
      user1: offerUser,
      user2: answerUser,
      matchTime,
    });

    await this.matchingHistoryRepository.save(newMatchingHistory);

    return newMatchingHistory;
  }

  async getMatchingHistories(take = DEFAULT_TAKE, skip = DEFAULT_SKIP) {
    const matchingHistories = await this.matchingHistoryRepository
      .createQueryBuilder('matchingHistory')
      .leftJoinAndSelect('matchingHistory.user1', 'user1')
      .leftJoinAndSelect('matchingHistory.user2', 'user2')
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
