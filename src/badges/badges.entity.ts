import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { BadgeCode } from 'src/types/badges.type';
import { UserToBadgeEntity } from 'src/user-to-badges/user-to-badges.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('badgeId', ['id'], { unique: true })
@Entity({
  name: 'BADGE',
})
export class BadgeEntity {
  @ApiProperty()
  @IsEnum(BadgeCode)
  @PrimaryColumn({ enum: BadgeCode })
  id: BadgeCode;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '뱃지의 이름을 설정해주세요.' })
  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '뱃지에 대한 설명을 설정해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: '뱃지에 이미지를 설정해주세요.' })
  @IsUrl()
  @Column({ type: 'varchar', nullable: false })
  imgUrl: string;

  @ApiProperty()
  @OneToMany(() => UserToBadgeEntity, (userToBadge) => userToBadge.badge, {
    cascade: true,
  })
  userToBadges: UserToBadgeEntity[];

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deleteAt?: Date | null;
}
