import { OmitType } from '@nestjs/swagger';
import { RecommendTopicEntity } from '../recommend-topics.entity';

export class RecommendTopicFormDTO extends OmitType(RecommendTopicEntity, [
  'id',
  'createdAt',
  'updatedAt',
  'deleteAt',
] as const) {}
