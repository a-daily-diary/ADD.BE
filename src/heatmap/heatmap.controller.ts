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
