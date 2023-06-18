import { Injectable } from '@nestjs/common';
import { TermsAgreementsService } from './terms-agreements/terms-agreements.service';

@Injectable()
export class AppService {
  constructor(
    private readonly termsAgreementsService: TermsAgreementsService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async setInitDataSet() {
    const settingResultToTermsAgreements =
      await this.termsAgreementsService.setInitDataSetForTermsAgreements();

    if (settingResultToTermsAgreements === false)
      throw new Error('약관 동의 설정하는 부분에서 에러가 발생하였습니다.');

    return { message: '데이터 초기 셋팅이 완료되었습니다.' };
  }
}
