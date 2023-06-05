import { PickType } from '@nestjs/swagger';
import { BadgeEntity } from '../badges.entity';

export class BadgeFormDTO extends PickType(BadgeEntity, [
  'id',
  'name',
  'description',
  'imgUrl',
] as const) {}
