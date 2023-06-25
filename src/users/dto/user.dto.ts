import { OmitType, PickType } from '@nestjs/swagger';
import { UserEntity } from '../users.entity';

export class UserDTO extends OmitType(UserEntity, ['password'] as const) {}

export class UserUpdateDTO extends PickType(UserEntity, [
  'username',
  'imgUrl',
] as const) {}
