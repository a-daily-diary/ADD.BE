import { Controller, Get, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './users/jwt/jwt.guard';
import { CurrentUser } from './common/decorators/current-user.decorator';
import { UserDTO } from './users/dto/user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HttpApiExceptionFilter } from './common/exceptions/http-api-exceptions.filter';

@Controller()
@UseFilters(HttpApiExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  @ApiOperation({
    summary: '약관동의, 뱃지 데이터 설정 API',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  setInitDataSet(@CurrentUser() requestUser: UserDTO) {
    return this.appService.setInitDataSet(requestUser);
  }
}
