import {
  Controller,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
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
import { responseExampleForCommon } from 'src/constants/swagger';

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
}
