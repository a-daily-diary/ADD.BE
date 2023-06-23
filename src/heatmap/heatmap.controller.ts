import { Controller, Get, Param, UseFilters, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { HeatmapService } from './heatmap.service';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { responseExampleForHeatmap } from 'src/constants/swagger';

@ApiTags('Heatmap')
@Controller('heatmap')
@UseFilters(HttpApiExceptionFilter)
export class HeatmapController {
  constructor(private readonly heatmapService: HeatmapService) {}

  @Get(':username')
  @ApiOperation({
    summary: '잔디 그래프 데이터용 API',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForHeatmap.graphData)
  @UseGuards(JwtAuthGuard)
  getHeatmapGraph(@Param('username') username: string) {
    return this.heatmapService.getHeatmapGraphData(username);
  }

  @Get('/:date')
  getDetailHeatmap() {
    return { message: '일자 별 활동 내역 상세 보기 API' };
  }
}
