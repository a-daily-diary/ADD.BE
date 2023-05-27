import { Module } from '@nestjs/common';
import { TermsAgreementsService } from './terms-agreements.service';
import { TermsAgreementsController } from './terms-agreements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermsAgreementEntity } from './terms-agreements.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TermsAgreementEntity])],
  providers: [TermsAgreementsService],
  controllers: [TermsAgreementsController],
})
export class TermsAgreementsModule {}
