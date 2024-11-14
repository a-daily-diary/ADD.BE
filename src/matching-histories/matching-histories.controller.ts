import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDTO } from 'src/users/dto/user.dto';
import { MatchingHistoriesService } from './matching-histories.service';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  responseExampleForFeedback,
  responseExampleForMatchingHistory,
} from 'src/constants/swagger';
import { FeedbackService } from 'src/feedback/feedback.service';
import { FeedbackFormDTO } from 'src/feedback/dto/feedback-form.dto';

@ApiTags('MatchingHistory')
@Controller('matching-histories')
@UseFilters(HttpApiExceptionFilter)
export class MatchingHistoriesController {
  constructor(
    private readonly matchingHistoriesService: MatchingHistoriesService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '매칭 이력 생성 (개발용)',
    description: `
    matchTime의 단위는 초(seconds)입니다.
    매칭 시작 시 offer role을 갖는 유가 매칭 이력을 생성합니다.
    `,
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForMatchingHistory.createMatchingHistory)
  @UseGuards(JwtAuthGuard)
  createMatchingHistory(
    @CurrentUser() currentUser: UserDTO,
    @Body()
    { matchedUserId, matchTime }: { matchedUserId: string; matchTime: number },
  ) {
    return this.matchingHistoriesService.create(
      currentUser.id,
      matchedUserId,
      matchTime,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: '매칭 이력 매칭 시간 수정 (개발용)',
    description: `
    matchTime의 단위는 초(seconds)입니다.
    매칭 종료 시 offer role을 갖는 유가 매칭 시간을 수정합니다.
    `,
  })
  @ApiResponse(responseExampleForMatchingHistory.updateMatchingHistory)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  updateMatchTime(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { matchTime }: { matchTime: number },
  ) {
    return this.matchingHistoriesService.updateMatchTime(id, matchTime);
  }

  @Get()
  @ApiOperation({
    summary: '매칭 이력 조회 (개발용)',
    description: '매칭 이력 생성일을 기준을 내림차순 정렬(최신 먼저)합니다.',
  })
  @ApiQuery({ name: 'take', required: false, type: 'number' })
  @ApiQuery({ name: 'skip', required: false, type: 'number' })
  @ApiResponse(responseExampleForMatchingHistory.getMatchingHistories)
  getMatchingHistories(
    @Query('take') take?: number | typeof NaN,
    @Query('skip') skip?: number | typeof NaN,
  ) {
    return this.matchingHistoriesService.getMatchingHistories(take, skip);
  }

  @Get('/recent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '유저의 최신 매칭 이력 조회',
    description: '해당 API를 요청하는 사용자의 최신 매칭 이력을 조회합니다.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForMatchingHistory.getRecentMatchingHistory)
  getRecentMatchingHistoryByUser(@CurrentUser() user: UserDTO) {
    return this.matchingHistoriesService.findRecentOneByUserId(user.id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '매칭 이력 삭제 (개발용)',
  })
  @ApiResponse(responseExampleForMatchingHistory.deleteMatchingHistory)
  deleteMatchingHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.matchingHistoriesService.delete(id);
  }

  // Feedback api
  @Post(':id/feedback')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '피드백 생성',
    description: '매칭 상대에 대한 피드백 생성 API 입니다.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForFeedback.create)
  createFeedback(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() feedbackFormDTO: FeedbackFormDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.feedbackService.create(currentUser, id, feedbackFormDTO);
  }
}
