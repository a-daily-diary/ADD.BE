import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { MatchingHistoryFormDTO } from './dto/matching-history-form.dto';
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
    summary: '매칭 이력 생성',
    description: `
    matchTime의 단위는 초(seconds)입니다.
    하나의 매칭이 종료되면 2개의 매칭 이력이 생성됩니다.(각자 이력 생성)`,
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForMatchingHistory.createMatchingHistory)
  @UseGuards(JwtAuthGuard)
  createMatchingHistory(
    @Body() matchingHistoryForm: MatchingHistoryFormDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.matchingHistoriesService.create(
      matchingHistoryForm,
      currentUser,
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
  deleteMatchingHistory(@Param('historyId', ParseUUIDPipe) historyId: string) {
    console.log(historyId);
    return this.matchingHistoriesService.delete(historyId);
  }
}
