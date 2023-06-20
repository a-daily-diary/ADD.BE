import { Controller, Get, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { HeatmapService } from './heatmap.service';

@ApiTags('Heatmap')
@Controller('heatmap')
@UseFilters(HttpApiExceptionFilter)
export class HeatmapController {
  constructor(private readonly heatmapService: HeatmapService) {}

  @Get('')
  getHeatmapGraph() {
    return this.heatmapService.heatmapTestAPI();
  }

  @Get('/:date')
  getDetailHeatmap() {
    return { message: '일자 별 활동 내역 상세 보기 API' };
  }
}
