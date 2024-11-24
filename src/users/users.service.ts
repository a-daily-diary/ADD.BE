import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UserEmailDTO, UserRegisterDTO } from './dto/user-register.dto';
import { UserEntity } from './users.entity';
import { UserLoginDTO } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { userExceptionMessage } from 'src/constants/exceptionMessage';
import { AwsService } from 'src/aws.service';
import { UserToTermsAgreementsService } from 'src/user-to-terms-agreements/user-to-terms-agreements.service';
import { UserDTO, UserUpdateDTO } from './dto/user.dto';
import { PasswordResetLinkDTO } from './dto/password-reset-link.dto';
import { MailService } from 'src/email.service';
import { PasswordResetDTO } from './dto/password-reset.dto';
import { TempTokenValidationDTO } from './dto/temp-token-validation.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly awsService: AwsService,
    private readonly userToTermsAgreementsService: UserToTermsAgreementsService,
    private readonly mailService: MailService,
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
      throw new BadRequestException(userExceptionMessage.EXIST_EMAIL);
    }

    const userByUsername = await this.usersRepository.findOneBy({ username });
    if (userByUsername) {
      throw new BadRequestException(userExceptionMessage.EXIST_USERNAME);
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
      throw new BadRequestException(userExceptionMessage.EXIST_EMAIL);
    }

    return { message: '사용가능한 이메일입니다.' };
  }

  async usernameExists(username: string) {
    const user = await this.usersRepository.findOneBy({
      username,
    });

    if (user) {
      throw new BadRequestException(userExceptionMessage.EXIST_USERNAME);
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

  async sendPasswordResetLink(sendPasswordResetLinkDTO: PasswordResetLinkDTO) {
    const { email, redirectUrl } = sendPasswordResetLinkDTO;

    const user = await this.findUserByEmail(email);

    user.tempToken = uuid.v1();

    await this.usersRepository.update(user.id, user);

    await this.mailService.sendEmail(
      user.email,
      '[ADD] 비밀번호 재설정 링크입니다.',
      `비밀번호 변경 링크입니다.
아래의 링크로 접근하여 비밀번호를 변경해주세요.

${redirectUrl}?email=${email}&token=${user.tempToken}`,
    );

    setTimeout(async () => {
      user.tempToken = null;

      await this.usersRepository.update(user.id, user);
    }, 1000 * 60 * 5); // 5 minutes

    return { message: '비밀번호 재설정 메일이 발송되었습니다.' };
  }

  async tempTokenValidation(tempTokenValidation: TempTokenValidationDTO) {
    const { email, tempToken } = tempTokenValidation;

    const user = await this.findUserByEmail(email);

    return { isValidate: user.tempToken === tempToken };
  }

  async passwordReset(passwordResetDTO: PasswordResetDTO) {
    const { email, password, token } = passwordResetDTO;

    let user: UserEntity;

    try {
      // JWT 토큰으로 비밀번호를 변경하는 경우
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      user = await this.findUserById(decoded.sub as string);

      if (user.email !== email)
        throw new BadRequestException(userExceptionMessage.INVALID_JWT_TOKEN);
    } catch {
      // 임시 토큰으로 비밀번호를 변경하는 경우
      user = await this.findUserByEmail(email);

      if (user.tempToken !== token)
        throw new BadRequestException(userExceptionMessage.INVALID_TOKEN);
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);

    user.password = hashedPassword;
    user.tempToken = null;

    await this.usersRepository.update(user.id, user);

    return { message: '비밀번호가 재설정되었습니다.' };
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user)
      throw new NotFoundException(userExceptionMessage.DOES_NOT_EXIST_USER);

    return user;
  }

  async findUserById(id: string) {
    const user = await this.usersRepository.findOneBy({ id });

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

  async updateUserInfo(accessedUser: UserDTO, userUpdateDto: UserUpdateDTO) {
    if (accessedUser.username !== userUpdateDto.username) {
      await this.usernameExists(userUpdateDto.username);
    }

    await this.usersRepository.update(accessedUser.id, userUpdateDto);
    return await this.findUserById(accessedUser.id);
  }
}
