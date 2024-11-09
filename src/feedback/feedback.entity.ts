import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
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
  @Column({ type: 'text', default: '' })
  content: string;

  @ApiProperty()
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  @IsNotEmpty({ message: '피드백 작성자를 입력해주세요.' })
  @JoinColumn({
    name: 'writer_id',
    referencedColumnName: 'id',
  })
  writer: UserEntity;

  @ApiProperty()
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  @IsNotEmpty({ message: '피드백 받는 사용자를 입력해주세요.' })
  @JoinColumn({
    name: 'recipient_id',
    referencedColumnName: 'id',
  })
  recipient: UserEntity;

  @ApiProperty()
  @ManyToOne(() => MatchingHistoryEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @IsNotEmpty({ message: '매칭 이력을 입력해주세요.' })
  @JoinColumn({
    name: 'matchingHistory_id',
    referencedColumnName: 'id',
  })
  matchingHistory: MatchingHistoryEntity;
}
