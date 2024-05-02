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
import { CommentsService } from 'src/comments/comments.service';
import { CommentFormDTO } from 'src/comments/dto/comment-form.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FileUploadDto } from 'src/common/dto/FileUpload.dto';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import {
  responseExampleForBookmark,
  responseExampleForComment,
  responseExampleForCommon,
  responseExampleForDiary,
  responseExampleForFavorite,
} from 'src/constants/swagger';
import { FavoritesService } from 'src/favorites/favorites.service';
import { UserDTO } from 'src/users/dto/user.dto';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { DiariesService } from './diaries.service';
import { DiaryFormDTO } from './dto/diary-form.dto';
import { DiarySortBy } from './diaries.type';

@ApiTags('Diary')
@Controller('diaries')
@UseFilters(HttpApiExceptionFilter)
export class DiariesController {
  constructor(
    private readonly diariesService: DiariesService,
    private readonly favoritesService: FavoritesService,
    private readonly bookmarksService: BookmarksService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'formdata instance에 append 시 key값을 image로 설정해주세요.',
    type: FileUploadDto,
  })
  @ApiOperation({
    summary: '일기 이미지 업로드',
  })
  @ApiResponse(responseExampleForCommon.uploadImg)
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
  @ApiQuery({ name: 'username', required: false, type: 'string' })
  @ApiQuery({ name: 'take', required: false, type: 'number' })
  @ApiQuery({ name: 'skip', required: false, type: 'number' })
  @ApiQuery({ name: 'searchKeyword', required: false, type: 'string' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    // When you change the sortBy Enum, you must also change the DiarySortBy type.
    enum: ['popularity', 'latest', 'comments'],
  })
  @ApiResponse(responseExampleForDiary.getDiaries)
  @UseGuards(JwtAuthGuard) // FIXME: 비로그인 상태 로직 생각하기
  getDiaries(
    @CurrentUser() currentUser: UserDTO,
    @Query('username') username?: string,
    @Query('take') take?: number | typeof NaN,
    @Query('skip') skip?: number | typeof NaN,
    @Query('searchKeyword') searchKeyword?: string,
    @Query('sortBy') sortBy?: DiarySortBy,
  ) {
    return this.diariesService.getDiaries(
      currentUser,
      username,
      searchKeyword,
      take,
      skip,
      sortBy,
    );
  }

  @Get('bookmark/:username')
  @ApiOperation({
    summary: '유저별 북마크한 일기 리스트 조회',
  })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'take', required: false, type: 'number' })
  @ApiQuery({ name: 'skip', required: false, type: 'number' })
  @ApiQuery({ name: 'searchKeyword', required: false, type: 'string' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    // When you change the sortBy Enum, you must also change the DiarySortBy type.
    enum: ['popularity', 'latest', 'comments'],
  })
  @ApiResponse(responseExampleForDiary.getDiariesByUsersBookmark)
  @UseGuards(JwtAuthGuard)
  getDiariesByUsersBookmark(
    @CurrentUser() currentUser: UserDTO,
    @Param('username') username: string,
    @Query('take') take?: number | typeof NaN,
    @Query('skip') skip?: number | typeof NaN,
    @Query('searchKeyword') searchKeyword?: string,
    @Query('sortBy') sortBy?: DiarySortBy,
  ) {
    return this.diariesService.getDiariesByUsersBookmark(
      currentUser,
      username,
      searchKeyword,
      take,
      skip,
      sortBy,
    );
  }

  @Get(':diaryId')
  @ApiOperation({
    summary: '일기 상세 조회',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForDiary.getDiary)
  @UseGuards(JwtAuthGuard) // FIXME: 비로그인 상태 로직 생각하기
  getDiary(
    @Param('diaryId', ParseUUIDPipe) diaryId: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.diariesService.getOne(diaryId, currentUser);
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

  @Put(':diaryId')
  @ApiOperation({
    summary: '일기 수정',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForDiary.updateDiary)
  @UseGuards(JwtAuthGuard)
  updateDiary(
    @Param('diaryId', ParseUUIDPipe) diaryId: string,
    @Body() diaryFormDto: DiaryFormDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.diariesService.update(diaryId, diaryFormDto, currentUser);
  }

  @Delete(':diaryId')
  @ApiOperation({
    summary: '일기 삭제',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForDiary.softDeleteDiary)
  @UseGuards(JwtAuthGuard)
  deleteDiary(
    @Param('diaryId', ParseUUIDPipe) diaryId: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.diariesService.delete(diaryId, currentUser);
  }

  // 좋아요 API
  @Post(':diaryId/favorite')
  @ApiOperation({
    summary: '일기 좋아요 등록',
    description: `
    뱃지 획득 응답을 위해 badge 속성을 같이 보내고 있습니다.
    획득 조건에 맞는 경우 badge 속성에 값이 있으며, 획득 조건이 아닌 경우는 null로 반환됩니다.`,
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForFavorite.registerFavorite)
  @UseGuards(JwtAuthGuard)
  registerFavorite(
    @Param('diaryId', ParseUUIDPipe) diaryId: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.favoritesService.register(diaryId, currentUser);
  }

  @Delete(':diaryId/favorite')
  @ApiOperation({
    summary: '일기 좋아요 취소',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForFavorite.unregisterFavorite)
  @UseGuards(JwtAuthGuard)
  unregisterFavorite(
    @Param('diaryId', ParseUUIDPipe) diaryId: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.favoritesService.unregister(diaryId, currentUser);
  }

  // 북마크 API
  @Post(':diaryId/bookmark')
  @ApiOperation({
    summary: '일기 북마크 등록',
    description: `
    뱃지 획득 응답을 위해 badge 속성을 같이 보내고 있습니다.
    획득 조건에 맞는 경우 badge 속성에 값이 있으며, 획득 조건이 아닌 경우는 null로 반환됩니다.`,
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBookmark.registerBookmark)
  @UseGuards(JwtAuthGuard)
  registerBookmark(
    @Param('diaryId', ParseUUIDPipe) diaryId: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.bookmarksService.register(diaryId, currentUser);
  }

  @Delete(':diaryId/bookmark')
  @ApiOperation({
    summary: '일기 북마크 취소',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBookmark.unregisterBookmark)
  @UseGuards(JwtAuthGuard)
  unregisterBookmark(
    @Param('diaryId', ParseUUIDPipe) diaryId: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.bookmarksService.unregister(diaryId, currentUser);
  }

  // 댓글 API
  @Post(':diaryId/comment')
  @ApiOperation({
    summary: '댓글 생성',
    description: `
    뱃지 획득 응답을 위해 badge 속성을 같이 보내고 있습니다.
    획득 조건에 맞는 경우 badge 속성에 값이 있으며, 획득 조건이 아닌 경우는 null로 반환됩니다.`,
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForComment.createComment)
  @UseGuards(JwtAuthGuard)
  createComment(
    @Param('diaryId', ParseUUIDPipe) diaryId: string,
    @CurrentUser() currentUser: UserDTO,
    @Body() commentFormDTO: CommentFormDTO,
  ) {
    return this.commentsService.createComment(
      diaryId,
      currentUser,
      commentFormDTO,
    );
  }

  @Get(':diaryId/comment')
  @ApiOperation({
    summary: '댓글 리스트 조회',
  })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'take', required: false, description: 'default value: 5' })
  @ApiQuery({ name: 'skip', required: false, description: 'default value: 0' })
  @ApiResponse(responseExampleForComment.getCommentList)
  @UseGuards(JwtAuthGuard)
  getCommentList(
    @Param('diaryId', ParseUUIDPipe) diaryId: string,
    @Query('take') take?: number | typeof NaN,
    @Query('skip') skip?: number | typeof NaN,
  ) {
    return this.commentsService.getCommentList(diaryId, take, skip);
  }

  @Put(':diaryId/comment/:commentId')
  @ApiOperation({
    summary: '댓글 수정',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForComment.updateComment)
  @UseGuards(JwtAuthGuard)
  updateComment(
    @Param('diaryId', ParseUUIDPipe) diaryId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() commentFormDTO: CommentFormDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.commentsService.updateComment(
      diaryId,
      commentId,
      currentUser,
      commentFormDTO,
    );
  }

  @Delete(':diaryId/comment/:commentId')
  @ApiOperation({
    summary: '댓글 삭제',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForComment.deleteComment)
  @UseGuards(JwtAuthGuard)
  deleteComment(
    @Param('diaryId', ParseUUIDPipe) diaryId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.commentsService.deleteComment(diaryId, commentId, currentUser);
  }
}
