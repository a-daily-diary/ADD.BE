import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { BookmarksService } from 'src/bookmarks/bookmarks.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FileUploadDto } from 'src/common/dto/FileUpload.dto';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import {
  responseExampleForBookmark,
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
  @ApiResponse(responseExampleForDiary.uploadDiaryImg)
  @UseInterceptors(FileInterceptor('image'))
  uploadUserImg(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.diariesService.uploadImg(file);
  }

  @Get()
  @ApiOperation({
    summary: '일기 리스트 조회',
  })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'username', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiResponse(responseExampleForDiary.getDiaries)
  @UseGuards(JwtAuthGuard) // FIXME: 비로그인 상태 로직 생각하기
  getDiaries(
    @CurrentUser() currentUser: UserDTO,
    @Query('username') username?: string,
    @Query('take') take?: number | typeof NaN,
    @Query('skip') skip?: number | typeof NaN,
  ) {
    console.log(username, take, skip);
    return this.diariesService.getDiaries(currentUser, username, take, skip);
  }

  @Get('bookmark/:username')
  @ApiOperation({
    summary: '유저별 북마크한 일기 리스트 조회',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForDiary.getDiariesByUsersBookmark)
  @UseGuards(JwtAuthGuard)
  getDiariesByUsersBookmark(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.diariesService.getDiariesByUsersBookmark(username, currentUser);
  }

  @Get(':id')
  @ApiOperation({
    summary: '일기 상세 조회',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForDiary.getDiary)
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
  @ApiResponse(responseExampleForDiary.createDiary)
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
  @ApiResponse(responseExampleForDiary.updateDiary)
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
  @ApiResponse(responseExampleForDiary.softDeleteDiary)
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
    summary: '일기 좋아요 등록',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForFavorite.registerFavorite)
  @UseGuards(JwtAuthGuard)
  registerFavorite(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.favoritesService.register(id, currentUser);
  }

  @Delete(':id/favorite')
  @ApiOperation({
    summary: '일기 좋아요 취소',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForFavorite.unregisterFavorite)
  @UseGuards(JwtAuthGuard)
  unregisterFavorite(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.favoritesService.unregister(id, currentUser);
  }

  // 북마크 API
  @Post(':id/bookmark')
  @ApiOperation({
    summary: '일기 북마크 등록',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBookmark.registerBookmark)
  @UseGuards(JwtAuthGuard)
  registerBookmark(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.bookmarksService.register(id, currentUser);
  }

  @Delete(':id/bookmark')
  @ApiOperation({
    summary: '일기 북마크 취소',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBookmark.unregisterBookmark)
  @UseGuards(JwtAuthGuard)
  unregisterBookmark(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.bookmarksService.unregister(id, currentUser);
  }
}
