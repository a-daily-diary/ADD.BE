import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToBadgeEntity } from './user-to-badges.entity';
import { Repository } from 'typeorm';
import { UserDTO } from 'src/users/dto/user.dto';
import { BadgeEntity } from 'src/badges/badges.entity';

@Injectable()
export class UserToBadgesService {
  constructor(
    @InjectRepository(UserToBadgeEntity)
    private readonly userToBadgeRepository: Repository<UserToBadgeEntity>,
  ) {}

  async saveUserToBadge(user: UserDTO, badge: BadgeEntity) {
    const pinnedCount = await this.userToBadgeRepository
      .createQueryBuilder('userToBadge')
      .where('userToBadge.user = :user', { user })
      .andWhere('userToBadge.isPinned = true')
      .getCount();

    const newUserToBadge = this.userToBadgeRepository.create({
      user,
      badge,
      isPinned: pinnedCount < 8,
    });
    try {
      await this.userToBadgeRepository.save(newUserToBadge);
    } catch {
      return false;
    }

    return true;
  }
}
