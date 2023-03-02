import { ApiProperty } from '@nestjs/swagger';
import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from 'src/common/entities/common.entity';
import { UserEntity } from 'src/users/users.entity';
import { DiaryEntity } from 'src/diaries/diaries.entity';

@Index('favoriteId', ['id'], { unique: true })
@Entity({
  name: 'FAVORITE',
})
export class FavoriteEntity extends CommonEntity {
  @ApiProperty()
  @ManyToOne(() => UserEntity, (author: UserEntity) => author.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'author_id',
    referencedColumnName: 'id',
  })
  author: UserEntity;

  @ApiProperty()
  @ManyToOne(() => DiaryEntity, (diary: DiaryEntity) => diary.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'diary_id',
    referencedColumnName: 'id',
  })
  diary: DiaryEntity;
}
