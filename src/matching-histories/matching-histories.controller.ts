import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { MatchingHistoryFormDTO } from './dto/matching-history-form.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDTO } from 'src/users/dto/user.dto';
import { MatchingHistoriesService } from './matching-histories.service';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';

@Controller('matching-histories')
@UseFilters(HttpApiExceptionFilter)
export class MatchingHistoriesController {
  constructor(
    private readonly matchingHistoriesService: MatchingHistoriesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createMatchingHistory(
    @Body() matchingHistoryForm: MatchingHistoryFormDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.matchingHistoriesService.create(
      matchingHistoryForm,
      currentUser,
    );
  }
}
