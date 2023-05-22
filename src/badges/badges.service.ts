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

  async createBadge(requsetUser: UserDTO, badgeFormDTO: BadgeFormDTO) {
    // TODO: requestUser가 admin인 경우에만 뱃지 생성할 수 있는 로직 추가 예정
    if (requsetUser.isAdmin === true) {
      throw new BadRequestException('뱃지 생성은 관리자만 가능합니다.');
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

  async getBadge(badgeId: string) {
    return await this.badgeRepository.findOneBy({ id: badgeId });
  }

  async updateBadge(badgeId: string, badgeFormDTO: BadgeFormDTO) {
    const targetBadge = await this.getBadge(badgeId);

    if (!targetBadge) {
      throw new NotFoundException(badgeExceptionMessage.DOES_NOT_EXIST_BADGE);
    }

    // FIXME: 접근한 유저가 관리자인기 확인 로직 추가 예정
    await this.badgeRepository.update(badgeId, badgeFormDTO);

    return await this.getBadge(badgeId);
  }
}
