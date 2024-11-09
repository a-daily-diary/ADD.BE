import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { IsBoolean, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { UserEntity } from 'src/users/users.entity';
import { MatchingHistoryEntity } from 'src/matching-histories/matching-histories.entity';

@Index('feedbackId', ['id'], { unique: true })
@Entity({
  name: 'FEEDBACK',
})
export class FeedbackEntity extends CommonEntity {
  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isNice: boolean;

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isFluent: boolean;

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isFun: boolean;

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isBad: boolean;

  @ApiProperty()
  @IsString()
  @Column({ type: 'text' })
  content: string;

  @ApiProperty()
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'giver_id',
    referencedColumnName: 'id',
  })
  giver: UserEntity;

  @ApiProperty()
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'receiver_id',
    referencedColumnName: 'id',
  })
  receiver: UserEntity;

  @ApiProperty()
  @ManyToOne(() => MatchingHistoryEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'matchingHistory_id',
    referencedColumnName: 'id',
  })
  matchingHistory: MatchingHistoryEntity;
}
