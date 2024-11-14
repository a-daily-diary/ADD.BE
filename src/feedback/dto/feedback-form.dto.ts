import { ApiProperty, PickType } from '@nestjs/swagger';
import { FeedbackEntity } from '../feedback.entity';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Column } from 'typeorm';

export class FeedbackFormDTO extends PickType(FeedbackEntity, [
  'isNice',
  'isFluent',
  'isFun',
  'isBad',
  'content',
] as const) {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty({ message: '매칭된 유저의 ID를 입력해주세요.' })
  @Column({ type: 'uuid' })
  matchedUserId: string;
}
