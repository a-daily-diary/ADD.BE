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
import { userExceptionMessage } from 'src/constants/exceptionMessage';
import { AwsService } from 'src/aws.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly awsService: AwsService,
  ) {}
  async uploadImg(file: Express.Multer.File) {
    const uploadInfo = await this.awsService.uploadFileToS3('users', file);
    return { imgUrl: this.awsService.getAwsS3FileUrl(uploadInfo.key) };
  }

  async join(userJoinDto: UserJoinDTO) {
    const { email, username, password } = userJoinDto;

    const userByEmail = await this.usersRepository.findOneBy({ email });
    if (userByEmail) {
      throw new UnauthorizedException(userExceptionMessage.EXIST_EMAIL);
    }

    const userByUsername = await this.usersRepository.findOneBy({ username });
    if (userByUsername) {
      throw new UnauthorizedException(userExceptionMessage.EXIST_USERNAME);
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
      throw new UnauthorizedException(userExceptionMessage.EXIST_EMAIL);
    }

    return { message: '사용가능한 이메일입니다.' };
  }

  async usernameCheck(username: string) {
    const user = await this.usersRepository.findOneBy({
      username,
    });

    if (user) {
      throw new UnauthorizedException(userExceptionMessage.EXIST_USERNAME);
    }

    return { message: '사용가능한 유저이름입니다.' };
  }

  async login(userloginDto: UserLoginDTO) {
    const { email, password } = userloginDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(userExceptionMessage.INCORRECT_LOGIN);
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
      throw new NotFoundException(userExceptionMessage.DOES_NOT_EXIST_USER);
    }
    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.diaries', 'diaries')
      .where('user.username = :username', { username })
      .getOne();

    if (!user) {
      throw new NotFoundException(userExceptionMessage.DOES_NOT_EXIST_USER);
    }
    return user;
  }

  async findAllUsers() {
    const users = await this.usersRepository.find();
    return users;
  }

  async getDefaultThumbnail() {
    const thumbnailList = await this.awsService.getDefaultThumbnail();
    return {
      thumbnailList,
    };
  }
}
