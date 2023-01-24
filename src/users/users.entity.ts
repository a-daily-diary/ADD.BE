import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, Index } from 'typeorm';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'USER',
})
export class UserEntity extends CommonEntity {
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요. ' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '유저 이름을 작성해주세요. ' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', default: 'http://127.0.0.1:5000' }) // FIXME: default image 설정
  thumbnailUrl: string;

  @IsBoolean()
  @Column({ type: 'boolean', nullable: false })
  isAgree: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;
}
