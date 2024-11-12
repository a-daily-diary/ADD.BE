import {
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpApiExceptionFilter } from 'src/common/exceptions/http-api-exceptions.filter';
import { BlacklistsService } from './blacklists.service';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDTO } from 'src/users/dto/user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { responseExampleForBlacklist } from 'src/constants/swagger';

@ApiTags('Blacklist')
@Controller('blacklist')
@UseFilters(HttpApiExceptionFilter)
export class BlacklistsController {
  constructor(private readonly blacklistsService: BlacklistsService) {}

  @Post(':blockedUserId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '블랙리스트 등록',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBlacklist.create)
  createBlacklist(
    @Param('blockedUserId', ParseUUIDPipe) blockedUserId: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.blacklistsService.create(currentUser, blockedUserId);
  }
}
