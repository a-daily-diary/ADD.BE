import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileUploadDto } from 'src/common/dto/FileUpload.dto';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import {
  responseExampleForCommon,
  responseExampleForUser,
} from 'src/constants/swagger';
import {
  UserEmailDTO,
  UserRegisterDTO,
  UsernameDTO,
} from './dto/user-register.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { UsersService } from './users.service';
import { UserDTO, UserUpdateDTO } from './dto/user.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PasswordResetLinkDTO } from './dto/password-reset-link.dto';
import { PasswordResetDTO } from './dto/password-reset.dto';
import { TempTokenValidationDTO } from './dto/temp-token-validation.dto';

@ApiTags('USER')
@Controller('users')
@UseFilters(HttpApiExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'formdata instance에 append 시 key값을 image로 설정해주세요.',
    type: FileUploadDto,
  })
  @ApiOperation({
    summary: '유저 img 업로드',
  })
  @ApiResponse(responseExampleForCommon.uploadImg)
  @UseInterceptors(FileInterceptor('image'))
  uploadUserImg(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.usersService.uploadImg(file);
  }

  @Get('')
  @ApiOperation({
    summary: '전체 유저 조회 (개발용)',
  })
  @ApiResponse(responseExampleForUser.getAllUsers)
  getAllUser() {
    return this.usersService.findAllUsers();
  }

  @Get('default-thumbnail')
  @ApiOperation({
    summary: '회원가입 시 기본으로 제공되는 이미지 경로 조회',
  })
  @ApiResponse(responseExampleForUser.getDefaultThumbnail)
  getDefaultThumbnail() {
    return this.usersService.getDefaultThumbnail();
  }

  @Get(':username')
  @ApiOperation({
    summary: '유저 정보 조회',
  })
  @ApiResponse(responseExampleForUser.getUserInfo)
  getUserInfo(@Param() { username }: UsernameDTO) {
    return this.usersService.findUserByUsername(username);
  }

  @Post('email-exists')
  @ApiOperation({
    summary: '이메일 중복 체크',
  })
  @ApiResponse(responseExampleForUser.emailExists)
  emailExists(@Body() userEmail: UserEmailDTO) {
    return this.usersService.emailExists(userEmail);
  }

  @Post('username-exists')
  @ApiOperation({
    summary: '유저 이름 중복 체크',
  })
  @ApiResponse(responseExampleForUser.usernameExists)
  usernameExists(@Body() { username }: UsernameDTO) {
    return this.usersService.usernameExists(username);
  }

  @Post('register')
  @ApiOperation({
    summary: '회원가입',
  })
  @ApiResponse(responseExampleForUser.register)
  register(@Body() userRegisterDTO: UserRegisterDTO) {
    return this.usersService.register(userRegisterDTO);
  }

  @Post('login')
  @ApiOperation({
    summary: '로그인',
  })
  @ApiResponse(responseExampleForUser.login)
  login(@Body() userLoginDto: UserLoginDTO) {
    return this.usersService.login(userLoginDto);
  }

  @Post('password-reset-link')
  @ApiOperation({
    summary: '비밀번호 재설정 링크 반환 API',
    description: `메일 발송 이후 5분 동안 해당 토큰을 사용할 수 있습니다.
<br />
아래는 사용자에게 반환되는 메일 내용입니다.

<div>비밀번호 변경 링크입니다.</div>
<div>아래의 링크로 접근하여 비밀번호를 변경해주세요.</div>
<br />
<div>\${redirectUrl}?email=\${email}&token=uuid</div>`,
  })
  @ApiResponse(responseExampleForUser.sendPasswordResetLink)
  sendPasswordResetLink(
    @Body() sendPasswordResetLinkDTO: PasswordResetLinkDTO,
  ) {
    return this.usersService.sendPasswordResetLink(sendPasswordResetLinkDTO);
  }

  @Post('temp-token-validation')
  @ApiOperation({
    summary: '이메일과 임시 토큰이 유효한지 여부를 반환하는 API',
    description:
      '이메일과 임시 토큰을 body로 요청하면, 유효여부를 boolean 값으로 반환합니다.',
  })
  @ApiResponse(responseExampleForUser.tempTokenValidation)
  tempTokenValidation(@Body() tempTokenValidationDTO: TempTokenValidationDTO) {
    return this.usersService.tempTokenValidation(tempTokenValidationDTO);
  }

  @Put('password')
  @ApiOperation({
    summary: '비밀번호 재설정 API',
  })
  @ApiResponse(responseExampleForUser.passwordReset)
  passwordReset(@Body() passwordResetDTO: PasswordResetDTO) {
    return this.usersService.passwordReset(passwordResetDTO);
  }

  @Put()
  @ApiOperation({
    summary: '유저 정보 수정 API',
    description:
      'username, imgUrl field만 수정 가능, username의 경우 중복 여부 체크, 둘 중에 한 개의 값만 수정하고 싶은 경우에도 두 개의 값을 보내주어야함(바뀌지 않는 값은 기존에 있던 값으로 요청)',
  })
  @ApiResponse(responseExampleForUser.getUserInfo)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  updateUserInfo(
    @CurrentUser() accessedUser: UserDTO,
    @Body() userUpdateDto: UserUpdateDTO,
  ) {
    return this.usersService.updateUserInfo(accessedUser, userUpdateDto);
  }
}
