import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseEnumPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { BadgesService } from './badges.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from 'src/common/dto/FileUpload.dto';
import {
  responseExampleForBadge,
  responseExampleForCommon,
} from 'src/constants/swagger';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDTO } from 'src/users/dto/user.dto';
import { BadgeFormDTO } from './dto/badge-form.dto';
import { BadgeCode } from 'src/types/badges.type';
import { UserToBadgesService } from 'src/user-to-badges/user-to-badges.service';
import { BadgeUpdateFormDTO } from './dto/badge-update-form.dto';

@ApiTags('Badge')
@Controller('badges')
@UseFilters(HttpApiExceptionFilter)
export class BadgesController {
  constructor(
    private readonly badgesService: BadgesService,
    private readonly userToBadgesService: UserToBadgesService,
  ) {}

  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'formdata instance에 append 시 key값을 image로 설정해주세요.',
    type: FileUploadDto,
  })
  @ApiOperation({
    summary: '뱃지 이미지 업로드',
  })
  @ApiResponse(responseExampleForCommon.uploadImg)
  @UseInterceptors(FileInterceptor('image'))
  updateBadgeImg(@UploadedFile() file: Express.Multer.File) {
    return this.badgesService.uploadImg(file);
  }

  @Post()
  @ApiOperation({
    summary: '뱃지 생성 (관리자용)',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBadge.createBadge)
  @UseGuards(JwtAuthGuard)
  createBadge(
    @CurrentUser() currentUser: UserDTO,
    @Body() badgeFormDTO: BadgeFormDTO,
  ) {
    return this.badgesService.createBadge(currentUser, badgeFormDTO);
  }

  @Get()
  @ApiOperation({
    summary: '뱃지 전체 조회 (개발용)',
    description: `
    뱃지에 대한 정보와 해당 뱃지를 획득한 유저들을 확인하기 위한 개발용 API입니다.`,
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBadge.getBadgeList)
  @UseGuards(JwtAuthGuard)
  getBadgeList() {
    return this.badgesService.getBadgeList();
  }

  @Get(':badgeId')
  @ApiOperation({
    summary: '뱃지 단건 조회',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBadge.getBadge)
  @UseGuards(JwtAuthGuard)
  getBadge(@Param('badgeId') badgeId: BadgeCode) {
    return this.badgesService.findById(badgeId);
  }

  @Get('users/:username')
  @ApiOperation({
    summary: '유저별 뱃지 전체 조회',
    description: `
      해당 유저의 뱃지 획득 유무, isPinned 여부 확인 가능
      - hasOwn: 뱃지 획득 유무
      - userToBadge: 획득 이력 정보(이력 id, isPinned 여부, 취득일) | null`,
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBadge.getBadgeListByUsername)
  @UseGuards(JwtAuthGuard)
  getBadgeListByUsername(
    @Param('username') username: string,
    @Query('onlyPinned', ParseBoolPipe) onlyPinned?: boolean,
  ) {
    return this.badgesService.getBadgeListByUsername(username, onlyPinned);
  }

  @Patch(':badgeId')
  @ApiOperation({
    summary: '뱃지 Pinned API',
    description: `
    API호출 직전의 isPinned 값의 반대 값으로 변경
    ex) false였던 뱃지에서 해당 API 호출 시 true로 변경`,
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBadge.pinnedBadge)
  @UseGuards(JwtAuthGuard)
  pinnedBadge(
    @CurrentUser() currentUser: UserDTO,
    @Param('badgeId', new ParseEnumPipe(BadgeCode)) badgeId: BadgeCode,
  ) {
    return this.userToBadgesService.pinnedBadge(currentUser, badgeId);
  }

  @Put(':badgeId')
  @ApiOperation({
    summary: '뱃지 수정 (관리자)',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBadge.updateBadge)
  @UseGuards(JwtAuthGuard)
  updateBadge(
    @Param('badgeId', new ParseEnumPipe(BadgeCode)) badgeId: BadgeCode,
    @Body() badgeUpdateFormDTO: BadgeUpdateFormDTO,
  ) {
    return this.badgesService.updateBadge(badgeId, badgeUpdateFormDTO);
  }

  @Delete(':badgeId')
  @ApiOperation({
    summary: '뱃지 삭제 (관리자)',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBadge.deleteBadge)
  @UseGuards(JwtAuthGuard)
  deleteBadge(
    @Param('badgeId', new ParseEnumPipe(BadgeCode))
    badgeId: BadgeCode,
  ) {
    return this.badgesService.deleteBadge(badgeId);
  }
}
