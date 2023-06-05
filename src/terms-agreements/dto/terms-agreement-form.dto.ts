import { PickType } from '@nestjs/swagger';
import { TermsAgreementEntity } from '../terms-agreements.entity';

export class TermsAgreementFormDTO extends PickType(TermsAgreementEntity, [
  'id',
  'title',
  'content',
  'isRequired',
] as const) {}
