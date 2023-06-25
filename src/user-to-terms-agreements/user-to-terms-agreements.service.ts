import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToTermsAgreementEntity } from './user-to-terms-agreements.entity';
import { Repository } from 'typeorm';
import { UserDTO } from 'src/users/dto/user.dto';
import { TermsAgreementsService } from 'src/terms-agreements/terms-agreements.service';
import { termsAgreementExceptionMessage } from 'src/constants/exceptionMessage';
import { TermsAgreementEnum } from 'src/types/terms-agreements.type';

@Injectable()
export class UserToTermsAgreementsService {
  constructor(
    @InjectRepository(UserToTermsAgreementEntity)
    private readonly userToTermsAgreementRepository: Repository<UserToTermsAgreementEntity>,
    private readonly termsAgreementsService: TermsAgreementsService,
  ) {}

  async saveUserToTermsAgreement(
    user: UserDTO,
    userCheckedTermsAgreementIdList: TermsAgreementEnum[],
  ) {
    const isValidateTermsAgreement =
      await this.termsAgreementsService.validatorRequiredTermsAgreements(
        userCheckedTermsAgreementIdList,
      );

    // 필수 값이 체크되지 않은 경우 early return
    if (!isValidateTermsAgreement)
      throw new BadRequestException(
        termsAgreementExceptionMessage.INVALIDATE_TERMS_AGREEMENTS,
      );

    const termsAgreementList =
      await this.termsAgreementsService.getTermsAgreementList();

    termsAgreementList.forEach(async (termsAgreement) => {
      const newUserToTermsAgreement =
        this.userToTermsAgreementRepository.create({
          user,
          termsAgreement,
          isAgreed: userCheckedTermsAgreementIdList.includes(termsAgreement.id),
        });

      await this.userToTermsAgreementRepository.save(newUserToTermsAgreement);
    });

    return true;
  }
}
