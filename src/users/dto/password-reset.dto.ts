import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Column } from 'typeorm';
import { UserEntity } from '../users.entity';

export class PasswordResetDTO extends PickType(UserEntity, ['email'] as const) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @ApiProperty()
  @IsUUID()
  @Column({ type: 'uuid', nullable: true, default: null })
  tempToken: string | null;
}
