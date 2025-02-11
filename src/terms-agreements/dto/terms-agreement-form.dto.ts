import { PickType } from '@nestjs/swagger';
import { TermsAgreementEntity } from '../terms-agreements.entity';

export class TermsAgreementFormDTO extends PickType(TermsAgreementEntity, [
  'id',
  'title',
  'contents',
  'isRequired',
] as const) {}
