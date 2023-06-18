import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEmailDTO, UserRegisterDTO } from './dto/user-register.dto';
import { UserEntity } from './users.entity';
import { UserLoginDTO } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { userExceptionMessage } from 'src/constants/exceptionMessage';
import { AwsService } from 'src/aws.service';
import { UserToTermsAgreementsService } from 'src/user-to-terms-agreements/user-to-terms-agreements.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly awsService: AwsService,
    private readonly userToTermsAgreementsService: UserToTermsAgreementsService,
  ) {}
  async uploadImg(file: Express.Multer.File) {
    const uploadInfo = await this.awsService.uploadFileToS3('users', file);
    return { imgUrl: this.awsService.getAwsS3FileUrl(uploadInfo.key) };
  }

  async register(userRegisterDTO: UserRegisterDTO) {
    const { email, username, password, imgUrl, termsAgreementIdList } =
      userRegisterDTO;

    const userByEmail = await this.usersRepository.findOneBy({ email });
    if (userByEmail) {
      throw new UnauthorizedException(userExceptionMessage.EXIST_EMAIL);
    }

    const userByUsername = await this.usersRepository.findOneBy({ username });
    if (userByUsername) {
      throw new UnauthorizedException(userExceptionMessage.EXIST_USERNAME);
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);

    const newUser = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
      imgUrl,
    });

    await this.usersRepository.save(newUser);

    await this.userToTermsAgreementsService.saveUserToTermsAgreement(
      newUser,
      termsAgreementIdList,
    );

    return { message: '회원가입에 성공하였습니다.' };
  }

  async emailExists(userEmail: UserEmailDTO) {
    const { email } = userEmail;

    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      throw new UnauthorizedException(userExceptionMessage.EXIST_EMAIL);
    }

    return { message: '사용가능한 이메일입니다.' };
  }

  async usernameExists(username: string) {
    const user = await this.usersRepository.findOneBy({
      username,
    });

    if (user) {
      throw new UnauthorizedException(userExceptionMessage.EXIST_USERNAME);
    }

    return { message: '사용가능한 유저이름입니다.' };
  }

  async login(userLoginDto: UserLoginDTO) {
    const { email, password } = userLoginDto;
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

  async generateAdminAccount() {
    const email = process.env.ADMIN_EMAIL;
    const username = process.env.ADMIN_USER;
    const password = process.env.ADMIN_PASSWORD;
    const imgUrl = (await this.awsService.getDefaultThumbnail())[0].path;
    const hashedPassword = await bcrypt.hashSync(password, 10);

    const adminUser = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
      imgUrl,
      isAdmin: true,
    });

    await this.usersRepository.save(adminUser);

    return adminUser;
  }
}
