import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { UserEntity } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('matchingHistoryId', ['id'], { unique: true })
@Entity({
  name: 'MATCHING_HISTORY',
})
export class MatchingHistoryEntity {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.matchingHistories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: UserEntity;

  @ApiProperty()
  @ManyToOne(() => UserEntity)
  matchedUser: UserEntity;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: '매칭 시간을 입력해주세요.' })
  @Column({ type: 'numeric', nullable: false })
  matchTime: number;

  @CreateDateColumn({
    type: 'timestamptz' /* timestamp with time zone */,
  })
  createdAt: Date;

  // Soft Delete : 기존에는 null, 삭제 시 timestamp를 찍는다.
  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deleteAt?: Date | null;
}
