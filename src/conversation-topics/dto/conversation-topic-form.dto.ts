import { OmitType } from '@nestjs/swagger';
import { ConversationTopicEntity } from '../conversation-topics.entity';

export class ConversationTopicFormDTO extends OmitType(
  ConversationTopicEntity,
  ['id', 'createdAt', 'updatedAt', 'deleteAt'] as const,
) {}
