import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { HeatmapService } from './heatmap.service';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { responseExampleForHeatmap } from 'src/constants/swagger';
import { heatmapExceptionMessage } from 'src/constants/exceptionMessage';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDTO } from 'src/users/dto/user.dto';

@ApiTags('Heatmap')
@Controller('heatmap')
@UseFilters(HttpApiExceptionFilter)
export class HeatmapController {
  constructor(private readonly heatmapService: HeatmapService) {}

  @Get('/graph/:username')
  @ApiOperation({
    summary: '잔디 그래프 데이터용 API',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForHeatmap.graphData)
  @UseGuards(JwtAuthGuard)
  getHeatmapGraph(@Param('username') username: string) {
    return this.heatmapService.getHeatmapGraphData(username);
  }

  @Get('/graph/:username/:dateString')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '날짜 별 유저 활동 내역 조회 API',
    description:
      '일기의 경우 공개 여부에 따라 응답(response) 구조 중 diaries에는 공개한 일기만 담겨져있습니다. diaryCount는 공개 여부와 상관없이 해당 날짜에 작성한 일기의 개수가 반환됩니다.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForHeatmap.getUserActivityHistory)
  @ApiParam({
    name: 'dateString',
    description:
      '2023-06-25와 같은 형식도 가능합니다. 다만 **2023-06-25**와 **2023-6-25**는 다르게 쿼리가 되므로 2자리 수를 지켜주세요',
  })
  getDetailHeatmap(
    @CurrentUser() accessedUser: UserDTO,
    @Param('username') username: string,
    @Param('dateString') dateString: string,
  ) {
    if (isNaN(Date.parse(dateString)))
      throw new BadRequestException(heatmapExceptionMessage.ONLY_DATE_TYPE);

    return this.heatmapService.getUserActivityHistory(
      accessedUser,
      username,
      new Date(dateString),
    );
  }
}
