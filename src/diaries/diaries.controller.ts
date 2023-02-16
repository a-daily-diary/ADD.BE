import {
  Body,
  Controller,
  Delete,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FileUploadDto } from 'src/common/dto/FileUpload.dto';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { multerOption } from 'src/common/utils/multer.options';
import { responseExample } from 'src/constants/swagger';
import { UserDTO } from 'src/users/dto/user.dto';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { DiariesService } from './diaries.service';
import { DiaryFormDTO } from './dto/diary-form.dto';

@ApiTags('Diary')
@Controller('diaries')
@UseFilters(HttpApiExceptionFilter)
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'formdata instance에 append 시 key값을 image로 설정해주세요.',
    type: FileUploadDto,
  })
  @ApiOperation({
    summary: '일기 이미지 업로드',
  })
  @ApiCreatedResponse(responseExample.uploadUserImg)
  @UseInterceptors(FileInterceptor('image', multerOption('diaries')))
  uploadUserImg(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.diariesService.uploadImg(file);
  }

  @Get()
  @ApiOperation({
    summary: '일기 전체 리스트 조회',
  })
  @ApiCreatedResponse(responseExample.getDiaries)
  getDiaries() {
    return this.diariesService.getAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '일기 상세 조회',
  })
  @ApiCreatedResponse(responseExample.getDiary)
  getDiary(@Param('id', ParseUUIDPipe) id: string) {
    return this.diariesService.getOne(id);
  }

  @Post()
  @ApiOperation({
    summary: '일기 생성',
  })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse(responseExample.createDiary)
  @UseGuards(JwtAuthGuard)
  createDiary(
    @Body() diaryFormDto: DiaryFormDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.diariesService.create(diaryFormDto, currentUser);
  }

  @Put(':id')
  @ApiOperation({
    summary: '일기 수정',
  })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse(responseExample.updateDiary)
  @UseGuards(JwtAuthGuard)
  updateDiary(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() diaryFormDto: DiaryFormDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.diariesService.update(id, diaryFormDto, currentUser);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '일기 삭제',
  })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse(responseExample.softDeleteDiary)
  @UseGuards(JwtAuthGuard)
  deleteDiary(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.diariesService.delete(id, currentUser);
  }
}
