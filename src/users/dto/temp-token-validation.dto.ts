import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Column } from 'typeorm';
import { UserEntity } from '../users.entity';

export class TempTokenValidationDTO extends PickType(UserEntity, [
  'email',
] as const) {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty({ message: '임시 토큰을 입력해주세요.' })
  @Column({ type: 'uuid' })
  tempToken: string;
}
