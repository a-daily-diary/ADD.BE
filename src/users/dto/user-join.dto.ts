import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../users.entity';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserJoinDTO extends PickType(UserEntity, [
  'email',
  'username',
] as const) {
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}

export class UserEmailCheckDTO extends PickType(UserEntity, [
  'email',
] as const) {}

export class UsernameCheckDTO extends PickType(UserEntity, [
  'username',
] as const) {}
