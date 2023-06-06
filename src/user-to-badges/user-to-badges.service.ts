import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToBadgeEntity } from './user-to-badges.entity';
import { Repository } from 'typeorm';
import { UserDTO } from 'src/users/dto/user.dto';
import { BadgeCode, BadgeAcquisitionCondition } from 'src/types/badges.type';
import { BadgesService } from 'src/badges/badges.service';
import { userToBadgesExceptionMessage } from 'src/constants/exceptionMessage';

@Injectable()
export class UserToBadgesService {
  constructor(
    @InjectRepository(UserToBadgeEntity)
    private readonly userToBadgeRepository: Repository<UserToBadgeEntity>,
    private readonly badgesService: BadgesService,
  ) {}

  async saveUserToBadge(user: UserDTO, badgeCode: BadgeCode) {
    const pinnedCount = await this.userToBadgeRepository
      .createQueryBuilder('userToBadge')
      .where('userToBadge.user.id = :userId', { userId: user.id })
      .andWhere('userToBadge.isPinned = true')
      .getCount();

    const badge = await this.badgesService.findById(badgeCode);

    const newUserToBadge = this.userToBadgeRepository.create({
      user,
      badge,
      isPinned: pinnedCount < 8,
    });
    try {
      await this.userToBadgeRepository.save(newUserToBadge);
    } catch {
      throw new Error('뱃지 이력 생성 도중 에러');
    }

    return badge;
  }

  async achievedBadge(
    user: UserDTO,
    currentConditionCount: number,
    badgeAcquisitionConditionList: BadgeAcquisitionCondition[],
  ) {
    const targetAcquisitionCondition = badgeAcquisitionConditionList.find(
      (badgeAcquisitionCondition) =>
        badgeAcquisitionCondition.conditionCount === currentConditionCount,
    );

    if (!targetAcquisitionCondition) {
      return null;
    }

    return await this.saveUserToBadge(
      user,
      targetAcquisitionCondition.badgeCode,
    );
  }

  async pinnedBadge(accessedUser: UserDTO, badgeId: BadgeCode) {
    const targetUserToBadge = await this.userToBadgeRepository
      .createQueryBuilder('userToBadges')
      .leftJoin('userToBadges.user', 'user')
      .leftJoin('userToBadges.badge', 'badge')
      .where('user.id = :userId', { userId: accessedUser.id })
      .andWhere('badge.id = :badgeId', { badgeId })
      .getOne();

    if (!targetUserToBadge)
      throw new NotFoundException(
        userToBadgesExceptionMessage.DOES_NOT_EXIST_USER_TO_BADGE,
      );

    const pinnedCount = await this.userToBadgeRepository
      .createQueryBuilder('userToBadge')
      .leftJoin('userToBadge.user', 'user')
      .where('user.id = :userId', { userId: accessedUser.id })
      .andWhere('userToBadge.isPinned = true')
      .getCount();

    if (targetUserToBadge.isPinned === false && pinnedCount === 8)
      throw new BadRequestException(userToBadgesExceptionMessage.ONLY_SET_8);

    targetUserToBadge.isPinned = !targetUserToBadge.isPinned;
    this.userToBadgeRepository.update(targetUserToBadge.id, targetUserToBadge);

    return targetUserToBadge;
  }
}
