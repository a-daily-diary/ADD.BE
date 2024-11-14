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

  async updateMatchTime(matchingHistoryId: string, matchTime: number) {
    await this.matchingHistoryRepository.update(matchingHistoryId, {
      matchTime,
    });

    return await this.findOneById(matchingHistoryId);
  }

  async findOneById(id: string) {
    const matchingHistory = await this.matchingHistoryRepository
      .createQueryBuilder('matchingHistory')
      .where('matchingHistory.id = :id', { id })
      .getOne();

    if (!matchingHistory)
      throw new NotFoundException(
        matchingHistoryExceptionMessage.DOES_NOT_EXIST_MATCHING_HISTORY,
      );

    return matchingHistory;
  }

  async findRecentOneByUserId(userId: string) {
    const latestMatchingHistoriesByUser = await this.matchingHistoryRepository
      .createQueryBuilder('matchingHistory')
      .leftJoinAndSelect('matchingHistory.user1', 'user1')
      .leftJoinAndSelect('matchingHistory.user2', 'user2')
      .where('user1.id = :userId', { userId })
      .orWhere('user2.id = :userId', { userId })
      .orderBy('matchingHistory.createdAt', 'DESC')
      .getOne();

    if (!latestMatchingHistoriesByUser)
      throw new NotFoundException(
        matchingHistoryExceptionMessage.DOES_NOT_EXIST_MATCHING_HISTORY,
      );

    const {
      user1,
      user2,
      deleteAt: _,
      ...matchingHistory
    } = latestMatchingHistoriesByUser;

    const response =
      user1.id === userId
        ? { ...matchingHistory, matchedUser: user2 }
        : { ...matchingHistory, matchedUser: user1 };

    return response;
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
