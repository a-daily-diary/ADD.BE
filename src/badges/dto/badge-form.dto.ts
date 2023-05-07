import { PickType } from '@nestjs/swagger';
import { BadgeEntity } from '../badges.entity';

export class BadgeFormDTO extends PickType(BadgeEntity, [
  'name',
  'description',
  'imgUrl',
] as const) {}
