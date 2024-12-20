import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { BookmarkEntity } from 'src/bookmarks/bookmarks.entity';
import { CommentEntity } from 'src/comments/comments.entity';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { FavoriteEntity } from 'src/favorites/favorites.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserToTermsAgreementEntity } from 'src/user-to-terms-agreements/user-to-terms-agreements.entity';
import { UserToBadgeEntity } from 'src/user-to-badges/user-to-badges.entity';
import { BlacklistEntity } from 'src/blacklists/blacklist.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'USER',
})
export class UserEntity {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  @IsUrl()
  @IsNotEmpty({ message: '프로필 사진을 설정해주세요. ' })
  @Column({ type: 'varchar', nullable: false })
  imgUrl: string;

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @ApiProperty()
  @Exclude()
  @IsUUID()
  @Column({ type: 'uuid', nullable: true, default: null })
  tempToken: string | null;

  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz' /* timestamp with time zone */,
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamptz' /* timestamp with time zone */,
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deleteAt?: Date | null;

  @ApiProperty()
  @OneToMany(() => DiaryEntity, (diary: DiaryEntity) => diary.author, {
    cascade: true,
  })
  diaries: DiaryEntity[];

  @ApiProperty()
  @OneToMany(
    () => FavoriteEntity,
    (favorite: FavoriteEntity) => favorite.user,
    {
      cascade: true,
    },
  )
  favorites: FavoriteEntity[];

  @ApiProperty()
  @OneToMany(
    () => BookmarkEntity,
    (bookmark: BookmarkEntity) => bookmark.user,
    {
      cascade: true,
    },
  )
  bookmarks: BookmarkEntity[];

  @ApiProperty()
  @OneToMany(
    () => CommentEntity,
    (comment: CommentEntity) => comment.commenter,
    {
      cascade: true,
    },
  )
  comments: CommentEntity[];

  @ApiProperty()
  @OneToMany(
    () => UserToTermsAgreementEntity,
    (userToTermsAgreement) => userToTermsAgreement.user,
    {
      cascade: true,
    },
  )
  userToTermsAgreements: UserToTermsAgreementEntity[];

  @ApiProperty()
  @OneToMany(() => UserToBadgeEntity, (userToBadges) => userToBadges.user, {
    cascade: true,
  })
  userToBadges: UserToBadgeEntity[];

  @ApiProperty()
  @OneToMany(() => BlacklistEntity, (blacklist) => blacklist.owner)
  blacklists: BlacklistEntity[];
}
