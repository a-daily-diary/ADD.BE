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
import { DEFAULT_TAKE } from 'src/constants/page';
import { DEFAULT_SKIP } from 'src/constants/page';
import { badgeExceptionMessage } from 'src/constants/exceptionMessage';
import { BadgeCode } from 'src/types';

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(BadgeEntity)
    private readonly badgeRepository: Repository<BadgeEntity>,
    private readonly awsService: AwsService,
  ) {}

  async uploadImg(file: Express.Multer.File) {
    const uploadInfo = await this.awsService.uploadFileToS3('badges', file);
    return { imgUrl: this.awsService.getAwsS3FileUrl(uploadInfo.key) };
  }

  async findByBadgeName(badgeName: string) {
    return await this.badgeRepository.findOneBy({ name: badgeName });
  }

  async createBadge(request: UserDTO, badgeFormDTO: BadgeFormDTO) {
    // TODO: requestUser가 admin인 경우에만 뱃지 생성할 수 있는 로직 추가 예정
    if (request.isAdmin === true) {
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

  async getBadgeList(take?: number, skip?: number) {
    const [badgeList, totalCount] = await this.badgeRepository
      .createQueryBuilder('badge')
      .take(take ?? DEFAULT_TAKE)
      .skip(skip ?? DEFAULT_SKIP)
      .getManyAndCount();

    return {
      badges: badgeList,
      totalCount,
      totalPage: Math.ceil(totalCount / (take ?? DEFAULT_TAKE)),
    };
  }

  async findById(badgeId: BadgeCode) {
    const badge = await this.badgeRepository.findOneBy({ id: badgeId });

    if (!badge)
      throw new NotFoundException(badgeExceptionMessage.DOES_NOT_EXIST_BADGE);

    return badge;
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
}
