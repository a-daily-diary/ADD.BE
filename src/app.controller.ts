import { Controller, Get, UseFilters } from '@nestjs/common';
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
}
