import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TermsAgreementEntity } from './terms-agreements.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TermsAgreementFormDTO } from './dto/terms-agreemtn-form.dto';
import { termsAgreementExceptionMessage } from 'src/constants/exceptionMessage';

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

  async getTermsAgreementList() {
    return await this.termsAgreementRepository.find();
  }

  async getTermsAgreement(termsAgreementId: number) {
    const targetTermsAgreement = await this.termsAgreementRepository.findOneBy({
      id: termsAgreementId,
    });

    if (!targetTermsAgreement) {
      throw new NotFoundException(
        termsAgreementExceptionMessage.DOES_NOT_EXIST_TERMS_AGREEMENT,
      );
    }

    return targetTermsAgreement;
  }
}
