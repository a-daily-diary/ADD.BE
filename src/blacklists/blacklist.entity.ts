import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from 'src/common/entities/common.entity';
import { UserEntity } from 'src/users/users.entity';
import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Index('blacklistId', ['id'], { unique: true })
@Entity({
  name: 'BLACKLIST',
})
export class BlacklistEntity extends CommonEntity {
  @ApiProperty()
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.blacklists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'owner_id',
    referencedColumnName: 'id',
  })
  owner: UserEntity;

  @ApiProperty()
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'blocked_user_id',
    referencedColumnName: 'id',
  })
  blockedUser: UserEntity;
}
