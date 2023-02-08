import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { UserEntity } from 'src/users/users.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Index('id', ['id'], { unique: true })
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
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  imgUrl: string;

  @ApiProperty()
  @IsNumber()
  @Column({ type: 'int', default: 0 })
  favoriteCount: number;

  @ApiProperty()
  @IsNumber()
  @Column({ type: 'int', default: 0 })
  commentCount: number;

  // TODO: User, favorite, bookmark, comment table relationship 필요
  @ApiProperty()
  @ManyToOne(() => UserEntity, (author: UserEntity) => author.diaries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'author_id',
    referencedColumnName: 'id',
  })
  author: UserEntity;
}
