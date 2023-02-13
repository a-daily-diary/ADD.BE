import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { multerOption } from 'src/common/utils/multer.options';
import { UserDTO } from 'src/users/dto/user.dto';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { DiariesService } from './diaries.service';
import { DiaryFormDTO } from './dto/diary-form.dto';

@Controller('diaries')
@UseFilters(HttpApiExceptionFilter)
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', multerOption('diaries')))
  uploadUserImg(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.diariesService.uploadImg(file);
  }

  @Get()
  getDiaries() {
    return this.diariesService.getAll();
  }

  @Get(':id')
  getDiary(@Param('id', ParseUUIDPipe) id: string) {
    return this.diariesService.getOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createDiary(
    @Body() diaryFormDto: DiaryFormDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.diariesService.create(diaryFormDto, currentUser);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateDiary(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() diaryFormDto: DiaryFormDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.diariesService.update(id, diaryFormDto, currentUser);
  }
}
