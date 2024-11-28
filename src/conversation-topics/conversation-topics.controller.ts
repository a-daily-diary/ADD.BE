import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ConversationTopicsService } from './conversation-topics.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { ConversationTopicFormDTO } from './dto/conversation-topic-form.dto';
import { responseExampleForConversationTopic } from 'src/constants/swagger';

@ApiTags('Conversation-topic')
@Controller('conversation-topics')
@UseFilters(HttpApiExceptionFilter)
export class ConversationTopicsController {
  constructor(private readonly topicsService: ConversationTopicsService) {}

  @Post()
  @ApiOperation({
    summary: '추천 대화 주제 생성 (개발용)',
  })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'take', required: false, type: 'number' })
  @ApiQuery({ name: 'skip', required: false, type: 'number' })
  @ApiResponse(responseExampleForConversationTopic.create)
  @UseGuards(JwtAuthGuard)
  createTopics(@Body() topicFormDTO: ConversationTopicFormDTO) {
    return this.topicsService.create(topicFormDTO);
  }

  @Get()
  @ApiOperation({
    summary: '추천 대화 주제 목록 조회 (개발용)',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForConversationTopic.list)
  @UseGuards(JwtAuthGuard)
  getTopics(
    @Query('take') take?: number | typeof NaN,
    @Query('skip') skip?: number | typeof NaN,
  ) {
    return this.topicsService.getList(take, skip);
  }
}
