import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FileUploadDto } from 'src/common/dto/FileUpload.dto';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import {
  responseExampleForCommon,
  responseExampleForUser,
} from 'src/constants/swagger';
import { UserEmailDTO, UserJoinDTO, UsernameDTO } from './dto/user-join.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserDTO } from './dto/user.dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { UsersService } from './users.service';

@ApiTags('USER')
@Controller('users')
@UseFilters(HttpApiExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upload')
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

  @Get()
  @ApiOperation({
    summary: '내 정보 조회 (토큰 필요)',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForUser.getCurrentUser)
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() currentUser: UserDTO) {
    return currentUser;
  }

  @Get('all')
  @ApiOperation({
    summary: '전체 유저 조회',
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

  @Post()
  @ApiOperation({
    summary: '회원가입',
  })
  @ApiResponse(responseExampleForUser.join)
  join(@Body() userJoinDto: UserJoinDTO) {
    return this.usersService.join(userJoinDto);
  }

  @Post('email-check')
  @ApiOperation({
    summary: '이메일 중복 체크',
  })
  @ApiResponse(responseExampleForUser.emailCheck)
  emailCheck(@Body() userEmail: UserEmailDTO) {
    return this.usersService.emailCheck(userEmail);
  }

  @Post('username-check')
  @ApiOperation({
    summary: '유저 이름 중복 체크',
  })
  @ApiResponse(responseExampleForUser.usernameCheck)
  usernameCheck(@Body() { username }: UsernameDTO) {
    return this.usersService.usernameCheck(username);
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
