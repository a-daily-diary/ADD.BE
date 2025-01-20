import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { responseExampleForRecommendTopic } from 'src/constants/swagger';
import { RecommendTopicFormDTO } from './dto/recommend-topic-form.dto';
import { RecommendTopicsService } from './recommend-topics.service';

@ApiTags('Recommend-topic')
@Controller('recommend-topics')
@UseFilters(HttpApiExceptionFilter)
export class RecommendTopicsController {
  constructor(private readonly topicsService: RecommendTopicsService) {}

  @Post()
  @ApiOperation({
    summary: '추천 대화 주제 생성 (개발용)',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForRecommendTopic.create)
  @UseGuards(JwtAuthGuard)
  createTopics(@Body() topicFormDTO: RecommendTopicFormDTO) {
    return this.topicsService.create(topicFormDTO);
  }

  @Post('/bulk')
  @ApiOperation({
    summary: '일괄 추천 대화 주제 생성 (개발용)',
  })
  @ApiBody({
    type: [RecommendTopicFormDTO],
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForRecommendTopic.bulkCreate)
  @UseGuards(JwtAuthGuard)
  bulkCreateTopics(@Body() topicFormDTOList: RecommendTopicFormDTO[]) {
    return this.topicsService.bulkCreate(topicFormDTOList);
  }

  @Get()
  @ApiOperation({
    summary: '추천 대화 주제 목록 조회 (개발용)',
  })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'take', required: false, type: 'number' })
  @ApiQuery({ name: 'skip', required: false, type: 'number' })
  @ApiResponse(responseExampleForRecommendTopic.list)
  @UseGuards(JwtAuthGuard)
  getTopics(
    @Query('take') take?: number | typeof NaN,
    @Query('skip') skip?: number | typeof NaN,
  ) {
    return this.topicsService.getList(take, skip);
  }

  @Get('/random')
  @ApiOperation({
    summary: '랜덤 추천 대화 주제 조회',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForRecommendTopic.randomTopic)
  @UseGuards(JwtAuthGuard)
  getRandomTopic() {
    return this.topicsService.getRandomTopic();
  }

  @Put(':id')
  @ApiOperation({
    summary: '추천 대화 주제 수정 (개발용)',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForRecommendTopic.update)
  @UseGuards(JwtAuthGuard)
  updateTopic(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() topicFormDTO: RecommendTopicFormDTO,
  ) {
    return this.topicsService.update(id, topicFormDTO);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '추천 대화 주제 삭제 (개발용)',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForRecommendTopic.delete)
  @UseGuards(JwtAuthGuard)
  deleteTopic(@Param('id', ParseUUIDPipe) id: string) {
    return this.topicsService.delete(id);
  }
}
