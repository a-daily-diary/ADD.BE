import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from '../users.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordResetLinkDTO extends PickType(UserEntity, [
  'email',
] as const) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '리다이렉트 링크를 입력해주세요.' })
  redirectUrl: string;
}
