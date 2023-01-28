import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { multerOption } from 'src/common/utils/multer.options';
import { UserEmailCheckDTO, UserJoinDTO } from './dto/user-join.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseFilters(HttpApiExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
