import { Injectable } from '@nestjs/common';
import { MatchingHistoryFormDTO } from './dto/matching-history-form.dto';
import { UserDTO } from 'src/users/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchingHistoryEntity } from './matching-histories.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

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

  async getMatchingHistories() {
    const matchingHistories = await this.matchingHistoryRepository
      .createQueryBuilder('matchingHistory')
      .leftJoinAndSelect('matchingHistory.user', 'user')
      .leftJoinAndSelect('matchingHistory.matchedUser', 'matchedUser')
      .getMany();

    return matchingHistories;
  }
}
