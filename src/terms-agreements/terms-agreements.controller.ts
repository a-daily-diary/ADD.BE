import { Body, Controller, Post } from '@nestjs/common';
import { TermsAgreementsService } from './terms-agreements.service';
import { TermsAgreementFormDTO } from './dto/terms-agreemtn-form.dto';

@Controller('terms-agreements')
export class TermsAgreementsController {
  constructor(
    private readonly termsAgreementsService: TermsAgreementsService,
  ) {}

  @Post()
  createTermsAgreement(@Body() termsAgreementFormDTO: TermsAgreementFormDTO) {
    return this.termsAgreementsService.createTermsAgreement(
      termsAgreementFormDTO,
    );
  }
}
