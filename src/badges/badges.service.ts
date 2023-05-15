import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws.service';
import { UserDTO } from 'src/users/dto/user.dto';
import { BadgeEntity } from './badges.entity';
import { Repository } from 'typeorm';
import { BadgeFormDTO } from './dto/badge-form.dto';

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
      .take(take ?? 10)
      .skip(skip ?? 0)
      .getManyAndCount();

    return {
      badges: badgeList,
      totalCount,
      totalPage: Math.ceil(totalCount / (take ?? 10)),
    };
  }
}
