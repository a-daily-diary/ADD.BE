import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from 'src/common/entities/common.entity';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { UserEntity } from 'src/users/users.entity';
import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Index('bookmarkId', ['id'], { unique: true })
@Entity({
  name: 'BOOKMARK',
})
export class BookmarkEntity extends CommonEntity {
  @ApiProperty()
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.bookmarks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: UserEntity;

  @ApiProperty()
  @ManyToOne(() => DiaryEntity, (diary: DiaryEntity) => diary.bookmarks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'diary_id',
    referencedColumnName: 'id',
  })
  diary: DiaryEntity;
}
