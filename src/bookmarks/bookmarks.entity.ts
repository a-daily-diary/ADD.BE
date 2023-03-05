import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from 'src/common/entities/common.entity';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { UserEntity } from 'src/users/users.entity';
import { Entity, Index } from 'typeorm';

@Index('bookmarkId', ['id'], { unique: true })
@Entity({
  name: 'BOOKMARK',
})
export class BookmarkEntity extends CommonEntity {
  @ApiProperty()
  author: UserEntity;

  @ApiProperty()
  diary: DiaryEntity;
}
