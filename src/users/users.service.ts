import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEmailDTO, UserJoinDTO } from './dto/user-join.dto';
import { UserEntity } from './users.entity';
import { UserLoginDTO } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
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

  async emailCheck(userEmail: UserEmailDTO) {
    const { email } = userEmail;

    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      throw new UnauthorizedException('해당하는 이메일은 이미 존재합니다.');
    }

    return { message: '사용가능한 이메일입니다.' };
  }

  async usernameCheck(username: string) {
    const user = await this.usersRepository.findOneBy({
      username,
    });

    if (user) {
      throw new UnauthorizedException('해당하는 유저 이름이 이미 존재합니다.');
    }

    return { message: '사용가능한 유저이름입니다.' };
  }

  async login(userloginDto: UserLoginDTO) {
    const { email, password } = userloginDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('로그인 정보를 확인해주세요.');
    }

    try {
      const jwt = await this.jwtService.signAsync(
        { sub: user.id },
        { secret: process.env.SECRET_KEY },
      );

      return { token: jwt, user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findUserById(id: string) {
    const user = this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedException('해당하는 유저가 존재하지 않습니다.');
    }
    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.usersRepository.findOneBy({ username });

    console.log(user);

    if (!user) {
      throw new NotFoundException('해당 유저 정보를 찾을 수 없습니다.');
    }
    return user;
  }
}
