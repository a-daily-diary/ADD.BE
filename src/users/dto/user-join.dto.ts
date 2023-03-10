import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from '../users.entity';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserJoinDTO extends PickType(UserEntity, [
  'email',
  'username',
  'isAgree',
] as const) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}

export class UserEmailDTO extends PickType(UserEntity, ['email'] as const) {}

export class UsernameDTO extends PickType(UserEntity, ['username'] as const) {}
