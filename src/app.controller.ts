import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HttpApiExceptionFilter } from './common/exceptions/http-api-exceptions.filter';

@Controller()
@UseFilters(HttpApiExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/send-mail')
  setMail() {
    return this.appService.sendEmail();
  }

  @Post()
  @ApiOperation({
    summary: '약관동의, 뱃지 데이터 설정 API',
  })
  setInitDataSet(@Body() adminKey: { adminKey: string }) {
    return this.appService.setInitDataSet(adminKey);
  }
}
