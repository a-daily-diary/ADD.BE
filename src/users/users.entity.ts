import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { FavoriteEntity } from 'src/favorities/favorites.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'USER',
})
export class UserEntity extends CommonEntity {
  @ApiProperty()
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요. ' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '유저 이름을 작성해주세요. ' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  username: string;

  @ApiProperty()
  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @ApiProperty()
  @Column({ type: 'varchar', default: 'http://127.0.0.1:5000' }) // FIXME: default image 설정
  thumbnailUrl: string;

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', nullable: false })
  isAgree: boolean;

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @ApiProperty()
  @OneToMany(() => DiaryEntity, (diary: DiaryEntity) => diary.author, {
    cascade: true,
  })
  diaries: DiaryEntity[];

  @ApiProperty()
  @OneToMany(
    () => FavoriteEntity,
    (favorite: FavoriteEntity) => favorite.author,
    {
      cascade: true,
    },
  )
  favorites: FavoriteEntity[];
}
