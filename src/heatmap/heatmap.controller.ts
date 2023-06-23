import { Controller, Get, Param, UseFilters, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { HeatmapService } from './heatmap.service';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';

@ApiTags('Heatmap')
@Controller('heatmap')
@UseFilters(HttpApiExceptionFilter)
export class HeatmapController {
  constructor(private readonly heatmapService: HeatmapService) {}

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  getHeatmapGraph(@Param('username') username: string) {
    return this.heatmapService.getHeatmapGraphData(username);
  }

  @Get('/:date')
  getDetailHeatmap() {
    return { message: '일자 별 활동 내역 상세 보기 API' };
  }
}
