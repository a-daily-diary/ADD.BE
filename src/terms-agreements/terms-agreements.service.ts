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

  async findById(id: string) {
    return await this.termsAgreementRepository.findOneBy({ id });
  }

  async getRequiredTermsAgreements() {
    return await this.termsAgreementRepository.find({
      where: { isRequired: true },
    });
  }

  /**
   * 파라미터로 전달받은 값이 필수 약관동의에 적합한지 확인해주는 함수
   *
   * validate한 경우 true 반환
   * 그렇지 않은 경우 false 반환
   */
  async validatorRequiredTermsAgreements(checkTermsAgreementIdList: string[]) {
    const requiredTermsAgreements = await this.getRequiredTermsAgreements();
    const requiredTermsAgreementIdList = requiredTermsAgreements.map(
      (el) => el.id,
    );

    return requiredTermsAgreementIdList.every((requiredId) =>
      checkTermsAgreementIdList.includes(requiredId),
    );
  }

  async createTermsAgreement(termsAgreementFormDTO: TermsAgreementFormDTO) {
    const newTermsAgreement = this.termsAgreementRepository.create(
      termsAgreementFormDTO,
    );

    return await this.termsAgreementRepository.save(newTermsAgreement);
  }

  async getTermsAgreementList() {
    return await this.termsAgreementRepository.find();
  }

  async getTermsAgreement(termsAgreementId: string) {
    const targetTermsAgreement = await this.findById(termsAgreementId);

    if (!targetTermsAgreement) {
      throw new NotFoundException(
        termsAgreementExceptionMessage.DOES_NOT_EXIST_TERMS_AGREEMENT,
      );
    }

    return targetTermsAgreement;
  }

  async deleteTermsAgreement(termsAgreementId: string) {
    const targetTermsAgreement = await this.findById(termsAgreementId);

    if (!targetTermsAgreement) {
      throw new NotFoundException(
        termsAgreementExceptionMessage.DOES_NOT_EXIST_TERMS_AGREEMENT,
      );
    }

    await this.termsAgreementRepository.delete(targetTermsAgreement);

    return { message: '삭제되었습니다.' };
  }
}
