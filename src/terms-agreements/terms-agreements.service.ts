import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { TermsAgreementEntity } from './terms-agreements.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TermsAgreementFormDTO } from './dto/terms-agreement-form.dto';
import { termsAgreementExceptionMessage } from 'src/constants/exceptionMessage';
import { TermsAgreementEnum } from 'src/types/terms-agreements.type';
import {
  marketingTermsAgreementDataSet,
  privacyTermsAgreementDataSet,
  serviceTermsAgreementDataSet,
} from 'src/data/termsAgreements';

@Injectable()
export class TermsAgreementsService {
  constructor(
    @InjectRepository(TermsAgreementEntity)
    private readonly termsAgreementRepository: Repository<TermsAgreementEntity>,
  ) {}

  async findById(id: TermsAgreementEnum) {
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
    const termsAgreement = await this.findById(termsAgreementFormDTO.id);

    if (termsAgreement) {
      throw new BadRequestException('중복된 약관동의 아이디입니다.');
    }

    const newTermsAgreement = this.termsAgreementRepository.create(
      termsAgreementFormDTO,
    );

    return await this.termsAgreementRepository.save(newTermsAgreement);
  }

  async getTermsAgreementList() {
    return await this.termsAgreementRepository.find();
  }

  async getTermsAgreement(termsAgreementId: TermsAgreementEnum) {
    const targetTermsAgreement = await this.findById(termsAgreementId);

    if (!targetTermsAgreement) {
      throw new NotFoundException(
        termsAgreementExceptionMessage.DOES_NOT_EXIST_TERMS_AGREEMENT,
      );
    }

    return targetTermsAgreement;
  }

  async deleteTermsAgreement(termsAgreementId: TermsAgreementEnum) {
    const targetTermsAgreement = await this.findById(termsAgreementId);

    if (!targetTermsAgreement) {
      throw new NotFoundException(
        termsAgreementExceptionMessage.DOES_NOT_EXIST_TERMS_AGREEMENT,
      );
    }

    await this.termsAgreementRepository.delete(targetTermsAgreement);

    return { message: '삭제되었습니다.' };
  }

  async setInitDataSetForTermsAgreements() {
    try {
      await this.createTermsAgreement(serviceTermsAgreementDataSet);
      await this.createTermsAgreement(privacyTermsAgreementDataSet);
      await this.createTermsAgreement(marketingTermsAgreementDataSet);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
