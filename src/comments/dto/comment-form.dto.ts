import { PickType } from '@nestjs/swagger';
import { CommentEntity } from '../comments.entity';

export class CommentFormDTO extends PickType(CommentEntity, [
  'comment',
] as const) {}
