import { Controller, Get, UseFilters } from '@nestjs/common';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { DiariesService } from './diaries.service';

@Controller('diaries')
@UseFilters(HttpApiExceptionFilter)
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Get()
  getDiaries() {
    return this.diariesService.getAll();
  }
}
