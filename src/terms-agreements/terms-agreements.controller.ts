import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { TermsAgreementsService } from './terms-agreements.service';
import { TermsAgreementFormDTO } from './dto/terms-agreement-form.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { responseExampleForTermsAgreement } from 'src/constants/swagger';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { TermsAgreementEnum } from 'src/types/terms-agreements.type';

@ApiTags('Terms-Agreement')
@Controller('terms-agreements')
@UseFilters(HttpApiExceptionFilter)
export class TermsAgreementsController {
  constructor(
    private readonly termsAgreementsService: TermsAgreementsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '약관 생성 (관리자)',
  })
  @ApiResponse(responseExampleForTermsAgreement.createTermsAgreement)
  createTermsAgreement(@Body() termsAgreementFormDTO: TermsAgreementFormDTO) {
    return this.termsAgreementsService.createTermsAgreement(
      termsAgreementFormDTO,
    );
  }

  @Get()
  @ApiOperation({
    summary: '약관 리스트 조회',
  })
  @ApiResponse(responseExampleForTermsAgreement.getTermsAgreementList)
  getTermsAgreementList() {
    return this.termsAgreementsService.getTermsAgreementList();
  }

  @Get(':termsAgreementId')
  @ApiOperation({
    summary: '약관 디테일 조회',
  })
  @ApiResponse(responseExampleForTermsAgreement.getTermsAgreement)
  getTermsAgreement(
    @Param('termsAgreementId') termsAgreementId: TermsAgreementEnum,
  ) {
    return this.termsAgreementsService.getTermsAgreement(termsAgreementId);
  }

  @Delete(':termsAgreementId')
  @ApiOperation({
    summary: '약관 삭제 (관리자)',
  })
  @ApiResponse(responseExampleForTermsAgreement.deleteTermsAgreement)
  deleteTermsAgreement(
    @Param('termsAgreementId') termsAgreementId: TermsAgreementEnum,
  ) {
    return this.termsAgreementsService.deleteTermsAgreement(termsAgreementId);
  }
}
