import { Controller, UseFilters } from '@nestjs/common';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { BlacklistsService } from './blacklists.service';

@Controller('blacklist')
@UseFilters(HttpApiExceptionFilter)
export class BlacklistsController {
  constructor(private readonly blacklistsService: BlacklistsService) {}
}
