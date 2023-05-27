import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TermsAgreementEntity } from './terms-agreements.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TermsAgreementFormDTO } from './dto/terms-agreemtn-form.dto';

@Injectable()
export class TermsAgreementsService {
  constructor(
    @InjectRepository(TermsAgreementEntity)
    private readonly termsAgreementRepository: Repository<TermsAgreementEntity>,
  ) {}

  async createTermsAgreement(termsAgreementFormDTO: TermsAgreementFormDTO) {
    const newTermsAgreement = this.termsAgreementRepository.create(
      termsAgreementFormDTO,
    );

    return await this.termsAgreementRepository.save(newTermsAgreement);
  }
}
