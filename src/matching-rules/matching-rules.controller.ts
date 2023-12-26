import { Controller, Get, UseFilters } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';

@ApiTags('MatchingRule')
@Controller('matching-rules')
@UseFilters(HttpApiExceptionFilter)
export class MatchingRulesController {
  @Get('')
  @ApiOperation({
    summary: '매칭 규칙 리스트 조회',
  })
  @ApiBearerAuth('access-token')
  getMatchingRules() {
    return [
      {
        imagePath:
          'http://add.bucket.s3.amazonaws.com/matching-rules/icon_en.png',
        rule: {
          ko: '한국어 보다는 영어 사용을 권장합니다.',
          en: 'We recommend using English rather than Korean.',
        },
      },
      {
        imagePath:
          'http://add.bucket.s3.amazonaws.com/matching-rules/icon_block.png',
        rule: {
          ko: '특정 횟수의 경고를 받은 사용자는 일부 서비스 사용이 차단될 수 있습니다.',
          en: 'Users who receive a certain number of warnings may be blocked from using some services.',
        },
      },
      {
        imagePath:
          'http://add.bucket.s3.amazonaws.com/matching-rules/icon_privacy.png',
        rule: {
          ko: '개인정보 노출 혹은 요청을 금지합니다.',
          en: 'Disclosure or request for personal information is prohibited.',
        },
      },
      {
        imagePath:
          'http://add.bucket.s3.amazonaws.com/matching-rules/icon_disease.png',
        rule: {
          ko: '선정적인 언어, 혐오/차별/폭력적인 언어, 불법 행위/기타 행위를 제한합니다.',
          en: 'We restrict suggestive language, hateful/discriminatory/violent language, and illegal acts/other actions.',
        },
      },
    ];
  }
}
