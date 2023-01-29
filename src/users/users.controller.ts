import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from 'src/common/dto/FileUpload.dto';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { multerOption } from 'src/common/utils/multer.options';
import {
  UserEmailCheckDTO,
  UserJoinDTO,
  UsernameCheckDTO,
} from './dto/user-join.dto';
import { UserLoginDTO } from './dto/user-login.dto';
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
  emailCheck(@Body() userEmail: UserEmailCheckDTO) {
    return this.usersService.emailCheck(userEmail);
  }

  @ApiOperation({
    summary: '유저 이름 중복 체크',
  })
  @Post('username-check')
  usernameCheck(@Body() username: UsernameCheckDTO) {
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
