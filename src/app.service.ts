import { BadRequestException, Injectable } from '@nestjs/common';
import { TermsAgreementsService } from './terms-agreements/terms-agreements.service';
import { BadgesService } from './badges/badges.service';
import { UserDTO } from './users/dto/user.dto';
import { exceptionMessage } from './constants/exceptionMessage';

@Injectable()
export class AppService {
  constructor(
    private readonly termsAgreementsService: TermsAgreementsService,
    private readonly badgesService: BadgesService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async setInitDataSet(requestUser: UserDTO) {
    // FIXME: 접근한 유저가 관리자인 경우에만 해당 API 사용할 수 있도록 처리하는 로직 추가
    // 차후 false로 변경
    if (requestUser.isAdmin === true)
      throw new BadRequestException(exceptionMessage.ONLY_ADMIN);

    const resultSettingToTermsAgreements =
      await this.termsAgreementsService.setInitDataSetForTermsAgreements();

    const resultSettingToBadges =
      await this.badgesService.setInitDataSetForBadges(requestUser);

    if (resultSettingToTermsAgreements === false)
      throw new Error(
        '약관 동의 데이터 설정하는 부분에서 에러가 발생하였습니다.',
      );

    if (resultSettingToBadges === false)
      throw new Error('뱃지 데이터 설정하는 부분에서 에러가 발생하였습니다.');

    return { message: '데이터 초기 셋팅이 완료되었습니다.' };
  }
}
