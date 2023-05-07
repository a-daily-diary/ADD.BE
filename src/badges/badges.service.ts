import { Injectable } from '@nestjs/common';
import { AwsService } from 'src/aws.service';

@Injectable()
export class BadgesService {
  constructor(private readonly awsService: AwsService) {}

  async uploadImg(file: Express.Multer.File) {
    const uploadInfo = await this.awsService.uploadFileToS3('badges', file);
    return { imgUrl: this.awsService.getAwsS3FileUrl(uploadInfo.key) };
  }
}
