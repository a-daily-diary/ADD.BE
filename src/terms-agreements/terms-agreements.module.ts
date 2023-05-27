import { Module } from '@nestjs/common';
import { TermsAgreementsService } from './terms-agreements.service';
import { TermsAgreementsController } from './terms-agreements.controller';

@Module({
  providers: [TermsAgreementsService],
  controllers: [TermsAgreementsController],
})
export class TermsAgreementsModule {}
