import { PickType } from '@nestjs/swagger';
import { DiaryEntity } from '../diaries.entity';

export class DiaryFormDTO extends PickType(DiaryEntity, [
  'title',
  'content',
  'imgUrl',
  'isPublic',
] as const) {}
