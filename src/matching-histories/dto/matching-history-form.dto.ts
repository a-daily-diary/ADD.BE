import { ApiProperty, PickType } from '@nestjs/swagger';
import { MatchingHistoryEntity } from '../matching-histories.entity';
import { IsNotEmpty } from 'class-validator';

export class MatchingHistoryFormDTO extends PickType(MatchingHistoryEntity, [
  'matchTime',
] as const) {
  @ApiProperty()
  @IsNotEmpty({ message: '매칭 상대의 아이디를 입력해주세요.' })
  matchedUserId: string;
}
