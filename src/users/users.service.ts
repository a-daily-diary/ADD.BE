import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserJoinDTO } from './dto/user-join.dto';
import { UserEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}
  uploadImg(file: Express.Multer.File) {
    const port = process.env.PORT;
    const thumbnailUrl = `http://127.0.0.1:${port}/media/users/${file.filename}`;
    return { imgUrl: thumbnailUrl };
  }

  async join(userJoinDto: UserJoinDTO) {
    const { email, username, password } = userJoinDto;

    const userByEmail = await this.usersRepository.findOneBy({ email });
    if (userByEmail) {
      throw new UnauthorizedException('해당하는 이메일은 이미 존재합니다.');
    }

    const userByUsername = await this.usersRepository.findOneBy({ username });
    if (userByUsername) {
      throw new UnauthorizedException('해당하는 유저이름이 이미 존재합니다.');
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);

    await this.usersRepository.save({
      ...userJoinDto,
      password: hashedPassword,
    });

    return { message: '회원가입에 성공하였습니다.' };
  }
}
