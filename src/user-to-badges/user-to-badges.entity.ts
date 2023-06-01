import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';
import { BadgeEntity } from 'src/badges/badges.entity';
import { UserEntity } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('userToBadgeId', ['id'], { unique: true })
@Entity({
  name: 'USER_TO_BADGE',
})
export class UserToBadgeEntity {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userToBadges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: UserEntity;

  @ApiProperty()
  @ManyToOne(() => BadgeEntity, (badge: BadgeEntity) => badge.userToBadges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'badge_id',
    referencedColumnName: 'id',
  })
  badge: BadgeEntity;

  @ApiProperty()
  @IsBoolean()
  @Column({ nullable: false })
  isPinned: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;
}
