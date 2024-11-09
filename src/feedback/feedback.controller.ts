import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { UserDTO } from 'src/users/dto/user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FeedbackFormDTO } from './dto/feedback-form.dto';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';

@Controller('feedback')
@UseFilters(HttpApiExceptionFilter)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post(':matchingHistoryId')
  @UseGuards(JwtAuthGuard)
  createFeedback(
    @Param('matchingHistoryId', ParseUUIDPipe) matchingHistoryId: string,
    @Body() feedbackFormDTO: FeedbackFormDTO,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.feedbackService.create(
      currentUser,
      matchingHistoryId,
      feedbackFormDTO,
    );
  }
}
