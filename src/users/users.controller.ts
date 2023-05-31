import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiOperation,
  ApiTags,
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
  register(@Body() UserRegisterDTO: UserRegisterDTO) {
    return this.usersService.register(UserRegisterDTO);
  }

  @Post('login')
  @ApiOperation({
    summary: '로그인',
  })
  @ApiResponse(responseExampleForUser.login)
  login(@Body() userLoginDto: UserLoginDTO) {
    return this.usersService.login(userLoginDto);
  }
}
