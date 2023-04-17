import * as path from 'path';
import * as AWS from 'aws-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PromiseResult } from 'aws-sdk/lib/request';

@Injectable()
export class AwsService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor() {
    this.awsS3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      region: process.env.AWS_S3_REGION,
    });
    this.S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
  }

  async uploadFileToS3(
    folder: string,
    file: Express.Multer.File,
  ): Promise<{
    key: string;
    s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    contentType: string;
  }> {
    try {
      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');

      const s3Object = await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();

      return { key, s3Object, contentType: file.mimetype };
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  public getAwsS3FileUrl(objectKey: string) {
    return `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;
  }

  public async getDefaultThumbnail() {
    const defaultThumbnailUrlList = [];

    const params = {
      Bucket: this.S3_BUCKET_NAME,
      Prefix: 'default/', // 폴더 경로
    };

    try {
      const data = await this.awsS3.listObjects(params).promise();

      data.Contents.forEach((content, idx) => {
        if (idx === 0) return; // 0 인덱스 해당 폴더를 의미함
        defaultThumbnailUrlList.push({
          fileName: content.Key.split('/')[1],
          path: this.getAwsS3FileUrl(content.Key),
        });
      });

      return defaultThumbnailUrlList;
    } catch (error) {
      console.log(error);
      throw new Error(
        'AWS S3에서 default 이미지를 가져오는 로직에서 에러 발생',
      );
    }
  }
}
