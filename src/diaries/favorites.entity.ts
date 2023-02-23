import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from 'src/common/entities/common.entity';
import { UserEntity } from 'src/users/users.entity';
import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

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
  author: string;
}
