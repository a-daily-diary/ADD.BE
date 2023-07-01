import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from '../users.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordResetDTO extends PickType(UserEntity, [
  'email',
  'tempToken',
] as const) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;
}
