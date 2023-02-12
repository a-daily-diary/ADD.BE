import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { UserDTO } from 'src/users/dto/user.dto';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { DiariesService } from './diaries.service';
import { DiaryFormDTO } from './dto/diary-form.dto';

@Controller('diaries')
@UseFilters(HttpApiExceptionFilter)
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Get()
  getDiaries() {
    return this.diariesService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createDiary(
    @Body() diaryFormDto: DiaryFormDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.diariesService.create(diaryFormDto, currentUser);
  }
}
