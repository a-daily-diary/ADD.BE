import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { UserToBadgeEntity } from 'src/users/userToBadge.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Index('badgeId', ['id'], { unique: true })
@Entity({
  name: 'BADGE',
})
export class BadgeEntity extends CommonEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '뱃지의 이름을 설정해주세요.' })
  @Column({ type: 'varchar', nullable: false })
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
  @OneToMany(() => UserToBadgeEntity, (userToBadge) => userToBadge.badge)
  userToBadges: UserToBadgeEntity[];
}
