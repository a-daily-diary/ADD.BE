import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
  ApiQuery,
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

@ApiTags('Badge')
@Controller('badges')
@UseFilters(HttpApiExceptionFilter)
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post('upload')
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
    summary: '뱃지 전체 조회',
  })
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'take', required: false, type: 'number' })
  @ApiQuery({ name: 'skip', required: false, type: 'number' })
  @ApiResponse(responseExampleForBadge.getBadgeList)
  @UseGuards(JwtAuthGuard)
  getBadgeList(
    @Query('take') take?: number | typeof NaN,
    @Query('skip') skip?: number | typeof NaN,
  ) {
    return this.badgesService.getBadgeList(take, skip);
  }

  @Get(':badgeId')
  @ApiOperation({
    summary: '뱃지 단건 조회',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBadge.getBadge)
  @UseGuards(JwtAuthGuard)
  getBadge(@Param('badgeId', ParseUUIDPipe) badgeId: string) {
    return this.badgesService.getBadge(badgeId);
  }

  @Put(':badgeId')
  @ApiOperation({
    summary: '뱃지 수정 (관리자)',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBadge.updateBadge)
  @UseGuards(JwtAuthGuard)
  updateBadge(
    @Param('badgeId', ParseUUIDPipe) badgeId: string,
    @Body() badgeFormDTO: BadgeFormDTO,
  ) {
    return this.badgesService.updateBadge(badgeId, badgeFormDTO);
  }

  @Delete(':badgeId')
  @ApiOperation({
    summary: '뱃지 삭제 (관리자)',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBadge.deleteBadge)
  @UseGuards(JwtAuthGuard)
  deleteBadge(@Param('badgeId', ParseUUIDPipe) badgeId: string) {
    return this.badgesService.deleteBadge(badgeId);
  }
}
