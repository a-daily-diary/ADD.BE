import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { UserDTO } from 'src/users/dto/user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FeedbackFormDTO } from './dto/feedback-form.dto';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { responseExampleForFeedback } from 'src/constants/swagger';
import { DateValidationPipe } from 'src/common/pipes/date-validation.pipe';

@ApiTags('Feedback')
@Controller('feedback')
@UseFilters(HttpApiExceptionFilter)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post(':matchingHistoryId')
  @ApiOperation({
    summary: '피드백 생성',
    description: '매칭 상대에 대한 피드백 생성 API 입니다.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForFeedback.create)
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

  @Get()
  @UseGuards(JwtAuthGuard)
  getFeedbackList(
    @Query('take') take?: number | typeof NaN,
    @Query('skip') skip?: number | typeof NaN,
    @Query('dateString', new DateValidationPipe(false)) date?: Date,
  ) {
    return this.feedbackService.getFeedbackList(take, skip, date);
  }
}
