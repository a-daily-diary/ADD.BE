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
import { responseExampleForMatchingHistory } from 'src/constants/swagger';

@ApiTags('MatchingHistory')
@Controller('matching-histories')
@UseFilters(HttpApiExceptionFilter)
export class MatchingHistoriesController {
  constructor(
    private readonly matchingHistoriesService: MatchingHistoriesService,
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

  @Patch(':matchingHistoryId')
  @ApiOperation({
    summary: '매칭 이력 매칭 시간 수정 (개발용)',
    description: `
    matchTime의 단위는 초(seconds)입니다.
    매칭 종료 시 offer role을 갖는 유가 매칭 시간을 수정합니다.
    `,
  })
  @ApiResponse(responseExampleForMatchingHistory.getMatchingHistory)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  updateMatchTime(
    @Param('matchingHistoryId', ParseUUIDPipe) matchingHistoryId: string,
    @Body() { matchTime }: { matchTime: number },
  ) {
    return this.matchingHistoriesService.updateMatchTime(
      matchingHistoryId,
      matchTime,
    );
  }

  @Get()
  @ApiOperation({
    summary: '매칭 이력 조회 (개발용)',
    description: '매칭 이력 생성일을 기준을 내림차순 정렬(최신 먼저)합니다.',
  })
  @ApiQuery({ name: 'take', required: false, type: 'number' })
  @ApiQuery({ name: 'skip', required: false, type: 'number' })
  @ApiResponse(responseExampleForMatchingHistory.getMatchingHistories)
  // 개발용
  getMatchingHistories(
    @Query('take') take?: number | typeof NaN,
    @Query('skip') skip?: number | typeof NaN,
  ) {
    return this.matchingHistoriesService.getMatchingHistories(take, skip);
  }

  @Delete(':historyId')
  @ApiOperation({
    summary: '매칭 이력 삭제 (개발용)',
  })
  @ApiResponse(responseExampleForMatchingHistory.deleteMatchingHistory)
  deleteMatchingHistory(@Param('historyId', ParseUUIDPipe) historyId: string) {
    console.log(historyId);
    return this.matchingHistoriesService.delete(historyId);
  }
}
