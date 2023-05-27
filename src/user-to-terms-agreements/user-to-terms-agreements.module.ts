import { Module } from '@nestjs/common';
import { UserToTermsAgreementsService } from './user-to-terms-agreements.service';

@Module({
  providers: [UserToTermsAgreementsService],
})
export class UserToTermsAgreementsModule {}
