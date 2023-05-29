import { Module } from '@nestjs/common';
import { UserToTermsAgreementsService } from './user-to-terms-agreements.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToTermsAgreementEntity } from './user-to-terms-agreements.entity';
import { TermsAgreementsModule } from 'src/terms-agreements/terms-agreements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserToTermsAgreementEntity]),
    TermsAgreementsModule,
  ],
  providers: [UserToTermsAgreementsService],
  exports: [UserToTermsAgreementsService],
})
export class UserToTermsAgreementsModule {}
