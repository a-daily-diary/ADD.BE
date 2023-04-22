import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { UserEntity } from 'src/users/users.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Index('commentId', ['id'], { unique: true })
@Entity({
  name: 'COMMENT',
})
export class CommentEntity extends CommonEntity {
  @ApiProperty()
  @IsString()
  @Column({ type: 'text' })
  comment: string;

  @ApiProperty()
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'comment_id',
    referencedColumnName: 'id',
  })
  commenter: UserEntity;

  @ApiProperty()
  @ManyToOne(() => DiaryEntity, (diary: DiaryEntity) => diary.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'diary_id',
    referencedColumnName: 'id',
  })
  diary: DiaryEntity;
}
