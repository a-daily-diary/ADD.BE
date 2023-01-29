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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FileUploadDto } from 'src/common/dto/FileUpload.dto';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { multerOption } from 'src/common/utils/multer.options';
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

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'formdata instance에 append 시 key값을 image로 설정해주세요.',
    type: FileUploadDto,
  })
  @ApiOperation({
    summary: '유저 thumbnail 업로드',
  })
  @UseInterceptors(FileInterceptor('image', multerOption('users')))
  @Post('upload')
  uploadUserImg(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.usersService.uploadImg(file);
  }

  @ApiOperation({
    summary: '내 정보 조회 (토큰 필요)',
  })
  @ApiBearerAuth('access-token')
  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() currentUser: UserDTO) {
    return currentUser;
  }

  @ApiOperation({
    summary: '유저 정보 조회',
  })
  @Get(':username')
  getUserInfo(@Param() { username }: UsernameDTO) {
    return this.usersService.findUserByUsername(username);
  }

  @ApiOperation({
    summary: '회원가입',
  })
  @Post()
  join(@Body() userJoinDto: UserJoinDTO) {
    return this.usersService.join(userJoinDto);
  }

  @ApiOperation({
    summary: '이메일 중복 체크',
  })
  @Post('email-check')
  emailCheck(@Body() userEmail: UserEmailDTO) {
    return this.usersService.emailCheck(userEmail);
  }

  @ApiOperation({
    summary: '유저 이름 중복 체크',
  })
  @Post('username-check')
  usernameCheck(@Body() { username }: UsernameDTO) {
    return this.usersService.usernameCheck(username);
  }

  @ApiOperation({
    summary: '로그인',
  })
  @Post('login')
  login(@Body() userLoginDto: UserLoginDTO) {
    return this.usersService.login(userLoginDto);
  }
}
