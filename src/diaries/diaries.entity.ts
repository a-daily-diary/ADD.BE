import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, Index } from 'typeorm';

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
  @Column({ type: 'number', default: 0 })
  favoriteCount: number;

  @ApiProperty()
  @IsNumber()
  @Column({ type: 'number', default: 0 })
  commentCount: number;

  // TODO: User, favorite, bookmark, comment table relationship 필요
}
