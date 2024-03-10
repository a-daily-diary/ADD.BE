import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { ActivitiesService } from './activities.service';
import { responseExampleForActivities } from 'src/constants/swagger';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { ActivitiesExceptionMessage } from 'src/constants/exceptionMessage';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDTO } from 'src/users/dto/user.dto';

@ApiTags('Activities')
@Controller('activities')
@UseFilters(HttpApiExceptionFilter)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('/:username')
  @ApiOperation({
    summary: '잔디 그래프 데이터용 API',
    description: '잔디 그래프 데이터는 연도별로 제공됩니다.',
  })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'year', required: false, type: 'string' })
  @ApiResponse(responseExampleForActivities.graphData)
  @UseGuards(JwtAuthGuard)
  getHeatmapGraph(
    @Param('username') username: string,
    @Query('year') year?: `${number}`,
  ) {
    if (year !== undefined && /^([0-9]){4}$/g.test(year) === false)
      throw new BadRequestException(
        ActivitiesExceptionMessage.ONLY_YEAR_FORMAT,
      );

    return this.activitiesService.getHeatmapGraphData(username, year);
  }

  @Get('/:username/:dateString')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '날짜 별 유저 활동 내역 조회 API',
    description:
      '일기의 경우 공개 여부에 따라 응답(response) 구조 중 diaries에는 공개한 일기만 담겨져있습니다. diaryCount는 공개 여부와 상관없이 해당 날짜에 작성한 일기의 개수가 반환됩니다.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForActivities.getUserActivity)
  @ApiParam({
    name: 'dateString',
    description:
      '2023-06-25와 같은 형식도 가능합니다. 다만 **2023-06-25**와 **2023-6-25**는 다르게 쿼리가 되므로 2자리 수를 지켜주세요',
  })
  getDetailActivity(
    @CurrentUser() accessedUser: UserDTO,
    @Param('username') username: string,
    @Param('dateString') dateString: string,
  ) {
    if (isNaN(Date.parse(dateString)))
      throw new BadRequestException(ActivitiesExceptionMessage.ONLY_DATE_TYPE);

    return this.activitiesService.getUserActivity(
      accessedUser,
      username,
      new Date(dateString),
    );
  }
}
