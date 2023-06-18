import { BadRequestException, Injectable } from '@nestjs/common';
import { TermsAgreementsService } from './terms-agreements/terms-agreements.service';
import { BadgesService } from './badges/badges.service';
import { exceptionMessage } from './constants/exceptionMessage';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly termsAgreementsService: TermsAgreementsService,
    private readonly badgesService: BadgesService,
    private readonly usersService: UsersService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async setInitDataSet(adminKey: { adminKey: string }) {
    const correctAdminToken = process.env.ADMIN_KEY;
    if (adminKey.adminKey !== correctAdminToken)
      throw new BadRequestException(exceptionMessage.INCORRECT_KEY);

    const adminUser = await this.usersService.generateAdminAccount();

    if (adminUser.isAdmin === false)
      throw new BadRequestException(exceptionMessage.ONLY_ADMIN);

    const resultSettingToTermsAgreements =
      await this.termsAgreementsService.setInitDataSetForTermsAgreements();

    const resultSettingToBadges =
      await this.badgesService.setInitDataSetForBadges(adminUser);

    if (resultSettingToTermsAgreements === false)
      throw new Error(
        '약관 동의 데이터 설정하는 부분에서 에러가 발생하였습니다.',
      );

    if (resultSettingToBadges === false)
      throw new Error('뱃지 데이터 설정하는 부분에서 에러가 발생하였습니다.');

    return { message: '데이터 초기 셋팅이 완료되었습니다.' };
  }
}
