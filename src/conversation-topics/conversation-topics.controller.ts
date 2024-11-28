import { Controller } from '@nestjs/common';
import { ConversationTopicsService } from './conversation-topics.service';

@Controller('conversation-topics')
export class ConversationTopicsController {
  constructor(private readonly topicsService: ConversationTopicsService) {}
}
