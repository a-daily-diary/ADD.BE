import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws.service';
import { UserDTO } from 'src/users/dto/user.dto';
import { BadgeEntity } from './badges.entity';
import { Repository } from 'typeorm';
import { BadgeFormDTO } from './dto/badge-form.dto';
import {
  badgeExceptionMessage,
  userExceptionMessage,
} from 'src/constants/exceptionMessage';
import { BadgeCode, BadgeListByUserResponse } from 'src/types/badges.type';
import { UsersService } from 'src/users/users.service';
import {
  bookmarkBadge,
  commentBadge,
  heartBadge,
  newBieBadge,
  steady0Badge,
  steady1Badge,
  steady2Badge,
  steady3Badge,
} from 'src/data/badges';

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(BadgeEntity)
    private readonly badgeRepository: Repository<BadgeEntity>,
    private readonly awsService: AwsService,
    private readonly usersService: UsersService,
  ) {}

  async uploadImg(file: Express.Multer.File) {
    const uploadInfo = await this.awsService.uploadFileToS3('badges', file);
    return { imgUrl: this.awsService.getAwsS3FileUrl(uploadInfo.key) };
  }

  async findByBadgeName(badgeName: string) {
    return await this.badgeRepository.findOneBy({ name: badgeName });
  }

  async createBadge(request: UserDTO, badgeFormDTO: BadgeFormDTO) {
    if (request.isAdmin === false) {
      throw new BadRequestException(badgeExceptionMessage.OWNER_ONLY_CREATE);
    }

    const hasBadgeName = await this.findByBadgeName(badgeFormDTO.name);

    if (hasBadgeName) {
      throw new BadRequestException(badgeExceptionMessage.EXIST_BADGE_NAME);
    }

    const newBadge = await this.badgeRepository.create(badgeFormDTO);
    await this.badgeRepository.save(newBadge);

    return newBadge;
  }

  async getBadgeList() {
    const badgeList = await this.badgeRepository
      .createQueryBuilder('badge')
      .leftJoinAndSelect('badge.userToBadges', 'userToBadges')
      .leftJoinAndSelect('userToBadges.user', 'badgeUser')
      .orderBy('badge.createdAt', 'ASC')
      .getMany();

    return badgeList;
  }

  async findById(badgeId: BadgeCode) {
    const badge = await this.badgeRepository.findOneBy({ id: badgeId });

    if (!badge)
      throw new NotFoundException(badgeExceptionMessage.DOES_NOT_EXIST_BADGE);

    return badge;
  }

  async getBadgeListByUsername(username: string, onlyPinned?: boolean) {
    const user = await this.usersService.findUserByUsername(username);

    if (!user)
      throw new NotFoundException(userExceptionMessage.DOES_NOT_EXIST_USER);

    const badgeSelectInstance = this.badgeRepository
      .createQueryBuilder('badge')
      .leftJoinAndSelect('badge.userToBadges', 'userToBadges')
      .leftJoinAndSelect('userToBadges.user', 'badgeUser');

    const badgeList = onlyPinned
      ? await badgeSelectInstance
          .where('badgeUser.id = :userId', { userId: user.id })
          .andWhere('userToBadges.isPinned = true')
          .orderBy('badge.createdAt', 'ASC')
          .getMany()
      : await badgeSelectInstance.orderBy('badge.createdAt', 'ASC').getMany();

    const newBadgeList: BadgeListByUserResponse[] = badgeList.map(
      (badgeInfo) => {
        const { userToBadges, deleteAt: _, ...otherBadgeInfo } = badgeInfo;

        const userToBadgeInfo = userToBadges.find(
          (userToBadge) => userToBadge.user.id === user.id,
        );

        const userToBadge = userToBadgeInfo
          ? {
              id: userToBadgeInfo.id,
              isPinned: userToBadgeInfo.isPinned,
              createdAt: userToBadgeInfo.createdAt,
            }
          : null;

        return {
          ...otherBadgeInfo,
          hasOwn: !!userToBadge,
          userToBadge,
        };
      },
    );

    return newBadgeList;
  }

  async updateBadge(badgeId: BadgeCode, badgeFormDTO: BadgeFormDTO) {
    const targetBadge = await this.findById(badgeId);

    if (!targetBadge) {
      throw new NotFoundException(badgeExceptionMessage.DOES_NOT_EXIST_BADGE);
    }

    const hasBadgeName = await this.findByBadgeName(badgeFormDTO.name);

    if (hasBadgeName) {
      throw new BadRequestException(badgeExceptionMessage.EXIST_BADGE_NAME);
    }

    // FIXME: 접근한 유저가 관리자인기 확인 로직 추가 예정
    await this.badgeRepository.update(badgeId, badgeFormDTO);

    return await this.findById(badgeId);
  }

  async deleteBadge(badgeId: BadgeCode) {
    const targetBadge = await this.findById(badgeId);

    if (!targetBadge) {
      throw new NotFoundException(badgeExceptionMessage.DOES_NOT_EXIST_BADGE);
    }

    // FIXME: 접근한 유저가 관리자인지 확인하는 로직 추가 예정

    await this.badgeRepository.softDelete(badgeId);

    return { message: '삭제되었습니다.' };
  }

  async setInitDataSetForBadges(requestUser: UserDTO) {
    try {
      await this.createBadge(requestUser, steady0Badge);
      await this.createBadge(requestUser, steady1Badge);
      await this.createBadge(requestUser, steady2Badge);
      await this.createBadge(requestUser, steady3Badge);
      await this.createBadge(requestUser, newBieBadge);
      await this.createBadge(requestUser, bookmarkBadge);
      await this.createBadge(requestUser, heartBadge);
      await this.createBadge(requestUser, commentBadge);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
