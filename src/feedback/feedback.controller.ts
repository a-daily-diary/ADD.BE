import {
  Body,
  Controller,
  Delete,
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
  ApiQuery,
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '피드백 생성',
    description: '매칭 상대에 대한 피드백 생성 API 입니다.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForFeedback.create)
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
  @ApiOperation({
    summary: '피드백 리스트 조회 (개발용)',
    description:
      '페이지네이션과 특정 일자에 대한 피드백을 조회할 수 있는 기능을 지원합니다.',
  })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'take', required: false, type: 'number' })
  @ApiQuery({ name: 'skip', required: false, type: 'number' })
  @ApiQuery({
    name: 'recipient',
    required: false,
    type: 'string',
    description: '피드백 받은 사용자의 이름을 입력해주세요.',
  })
  @ApiQuery({
    name: 'dateString',
    required: false,
    type: 'string',
    description: 'YYYY-MM-DD 형식을 맞춰주세요.',
  })
  @ApiResponse(responseExampleForFeedback.getFeedbackList)
  getFeedbackList(
    @Query('take') take?: number | typeof NaN,
    @Query('skip') skip?: number | typeof NaN,
    @Query('recipient') recipient?: string,
    @Query('dateString', new DateValidationPipe(false)) date?: Date,
  ) {
    return this.feedbackService.getFeedbackList(take, skip, recipient, date);
  }

  @Delete(':feedbackId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '피드백 삭제 (개발용)',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForFeedback.delete)
  delete(@Param('feedbackId', ParseUUIDPipe) feedbackId: string) {
    return this.feedbackService.delete(feedbackId);
  }
}
