import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlacklistEntity } from './blacklist.entity';
import { Repository } from 'typeorm';
import { UserDTO } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { blacklistExceptionMessage } from 'src/constants/exceptionMessage';

@Injectable()
export class BlacklistsService {
  constructor(
    @InjectRepository(BlacklistEntity)
    private readonly blacklistRepository: Repository<BlacklistEntity>,
    private readonly usersService: UsersService,
  ) {}

  async getBlacklistHistory(owner: UserDTO, unblockUser: UserDTO) {
    const blacklistHistory = await this.blacklistRepository
      .createQueryBuilder('blacklist')
      .leftJoin('blacklist.owner', 'owner')
      .leftJoin('blacklist.blockedUser', 'blockedUser')
      .where('(owner.id = :ownerId AND blockedUser.id = :unblockUserId)', {
        ownerId: owner.id,
        unblockUserId: unblockUser.id,
      })
      .getOne();

    if (!blacklistHistory)
      throw new NotFoundException(
        blacklistExceptionMessage.DOES_NOT_EXIST_BLACKLIST,
      );

    return blacklistHistory;
  }

  async getBlockedUserList(ownerId: string) {
    const blacklistsByUser = await this.blacklistRepository
      .createQueryBuilder('blacklist')
      .leftJoin('blacklist.owner', 'owner')
      .leftJoinAndSelect('blacklist.blockedUser', 'blockedUser')
      .where('owner.id = :ownerId', { ownerId })
      .orderBy('blacklist.createdAt', 'DESC')
      .getMany();

    return blacklistsByUser.map((blacklists) => blacklists.blockedUser);
  }

  async blockUser(currentUser: UserDTO, blockedUserId: string) {
    const blockedUserList = await this.getBlockedUserList(currentUser.id);

    if (blockedUserList.find((blockedUser) => blockedUser.id === blockedUserId))
      throw new BadRequestException(
        blacklistExceptionMessage.EXIST_BLOCKED_USER,
      );

    const blockedUser = await this.usersService.findUserById(blockedUserId);

    const newBlacklist = this.blacklistRepository.create({
      owner: currentUser,
      blockedUser,
    });

    await this.blacklistRepository.save(newBlacklist);

    return newBlacklist;
  }

  async unblockUser(currentUser: UserDTO, unblockUserId: string) {
    const unblockUser = await this.usersService.findUserById(unblockUserId);

    const blacklistHistory = await this.getBlacklistHistory(
      currentUser,
      unblockUser,
    );

    await this.blacklistRepository.softDelete(blacklistHistory.id);

    return { message: '취소되었습니다.' };
  }
}
