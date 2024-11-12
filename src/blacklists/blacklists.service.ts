import { BadRequestException, Injectable } from '@nestjs/common';
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

  async create(currentUser: UserDTO, blockedUserId: string) {
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
}
