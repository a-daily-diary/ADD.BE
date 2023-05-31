import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { UserEntity } from 'src/users/users.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { FavoriteEntity } from 'src/favorites/favorites.entity';
import { BookmarkEntity } from 'src/bookmarks/bookmarks.entity';
import { CommentEntity } from 'src/comments/comments.entity';

@Index('diaryId', ['id'], { unique: true })
@Entity({
  name: 'DIARY',
})
export class DiaryEntity extends CommonEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '제목을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '내용을 작성해주세요. ' })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  imgUrl: string;

  @ApiProperty()
  @IsNotEmpty({ message: '공개 여부를 설정해주세요.' })
  @Column({ type: 'boolean', nullable: false })
  isPublic: boolean;

  @ApiProperty()
  @IsNumber()
  @Column({ type: 'int', default: 0 })
  favoriteCount: number;

  @ApiProperty()
  @IsNumber()
  @Column({ type: 'int', default: 0 })
  commentCount: number;

  @ApiProperty()
  @ManyToOne(() => UserEntity, (author: UserEntity) => author.diaries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'author_id',
    referencedColumnName: 'id',
  })
  author: UserEntity;

  @ApiProperty()
  @OneToMany(
    () => FavoriteEntity,
    (favorite: FavoriteEntity) => favorite.diary,
    {
      cascade: true,
    },
  )
  favorites: FavoriteEntity[];

  @ApiProperty()
  @OneToMany(
    () => BookmarkEntity,
    (bookmark: BookmarkEntity) => bookmark.diary,
    {
      cascade: true,
    },
  )
  bookmarks: BookmarkEntity[];

  @ApiProperty()
  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.diary, {
    cascade: true,
  })
  comments: CommentEntity[];
}
