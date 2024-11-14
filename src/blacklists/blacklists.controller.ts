import {
  Controller,
  Delete,
  Get,
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
  blockUser(
    @Param('blockedUserId', ParseUUIDPipe) blockedUserId: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.blacklistsService.blockUser(currentUser, blockedUserId);
  }

  @Get(':ownerId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '특정 유저의 블랙리스트한 유저들 조회',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBlacklist.getBlockedUserList)
  getBlockedUserList(@Param('ownerId', ParseUUIDPipe) ownerId: string) {
    return this.blacklistsService.getBlockedUserList(ownerId);
  }

  @Delete(':unblockUserId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '블랙리스트 취소',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse(responseExampleForBlacklist.delete)
  unblockUser(
    @Param('unblockUserId', ParseUUIDPipe) unblockUserId: string,
    @CurrentUser() currentUser: UserDTO,
  ) {
    return this.blacklistsService.unblockUser(currentUser, unblockUserId);
  }
}
