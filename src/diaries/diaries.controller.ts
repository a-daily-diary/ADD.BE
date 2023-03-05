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
import { BookmarksService } from 'src/bookmarks/bookmarks.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FileUploadDto } from 'src/common/dto/FileUpload.dto';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { multerOption } from 'src/common/utils/multer.options';
import {
  responseExampleForDiary,
  responseExampleForFavorite,
} from 'src/constants/swagger';
import { FavoritesService } from 'src/favorities/favorites.service';
import { UserDTO } from 'src/users/dto/user.dto';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { DiariesService } from './diaries.service';
import { DiaryFormDTO } from './dto/diary-form.dto';

@ApiTags('Diary')
@Controller('diaries')
@UseFilters(HttpApiExceptionFilter)
export class DiariesController {
  constructor(
    private readonly diariesService: DiariesService,
    private readonly favoritesService: FavoritesService,
    private readonly bookmarksService: BookmarksService,
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'formdata instance에 append 시 key값을 image로 설정해주세요.',
    type: FileUploadDto,
  })
  @ApiOperation({
    summary: '일기 이미지 업로드',
  })
  @ApiCreatedResponse(responseExampleForDiary.uploadDiaryImg)
  @UseInterceptors(FileInterceptor('image', multerOption('diaries')))
  uploadUserImg(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.diariesService.uploadImg(file);
  }

  @Get()
  @ApiOperation({
    summary: '일기 전체 리스트 조회',
  })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse(responseExampleForDiary.getDiaries)
  @UseGuards(JwtAuthGuard) // FIXME: 비로그인 상태 로직 생각하기
  getDiaries(@CurrentUser() currentUser: UserDTO) {
    return this.diariesService.getAll(currentUser);
  }

  @Get('bookmark')
  getAllBookmark() {
    return this.bookmarksService.getAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '일기 상세 조회',
  })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse(responseExampleForDiary.getDiary)
  @UseGuards(JwtAuthGuard) // FIXME: 비로그인 상태 로직 생각하기
  getDiary(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.diariesService.getOne(id, currentUser);
  }

  @Post()
  @ApiOperation({
    summary: '일기 생성',
  })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse(responseExampleForDiary.createDiary)
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
  @ApiCreatedResponse(responseExampleForDiary.updateDiary)
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
  @ApiCreatedResponse(responseExampleForDiary.softDeleteDiary)
  @UseGuards(JwtAuthGuard)
  deleteDiary(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.diariesService.delete(id, currentUser);
  }

  // 좋아요 API
  @Post(':id/favorite')
  @ApiOperation({
    summary: '일기 좋아요 추가',
  })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse(responseExampleForFavorite.createFavorite)
  @UseGuards(JwtAuthGuard)
  createFavorite(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.favoritesService.create(id, currentUser);
  }

  @Delete(':id/favorite')
  @ApiOperation({
    summary: '일기 좋아요 취소',
  })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse(responseExampleForFavorite.deleteFavorite)
  @UseGuards(JwtAuthGuard)
  deleteFavorite(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.favoritesService.delete(id, currentUser);
  }

  // 북마크 API
  @Post(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  createBookmark(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.bookmarksService.create(id, currentUser);
  }
}
