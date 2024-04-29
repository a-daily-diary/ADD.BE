import { PartialType, PickType } from '@nestjs/swagger';
import { BadgeEntity } from '../badges.entity';

export class BadgeUpdateFormDTO extends PartialType(
  PickType(BadgeEntity, ['name', 'description', 'imgUrl'] as const),
) {}
