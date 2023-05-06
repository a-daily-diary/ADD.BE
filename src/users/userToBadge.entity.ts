import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Entity, Index, ManyToOne } from 'typeorm';
import { UserEntity } from './users.entity';
import { BadgeEntity } from 'src/badges/badges.entity';

@Index('userToBadgeId', ['id'], { unique: true })
@Entity({
  name: 'userToBadge',
})
export class UserToBadgeEntity extends CommonEntity {
  @ApiProperty()
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userToBadges, {
    cascade: true,
  })
  user: UserEntity;

  @ApiProperty()
  @ManyToOne(() => BadgeEntity, (badge: BadgeEntity) => badge.userToBadges, {
    cascade: true,
  })
  badge: BadgeEntity;
}
