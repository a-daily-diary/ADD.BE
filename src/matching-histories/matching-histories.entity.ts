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
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'user_1_id',
    referencedColumnName: 'id',
  })
  user1: UserEntity;

  @ApiProperty()
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'user_2_id',
    referencedColumnName: 'id',
  })
  user2: UserEntity;

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
