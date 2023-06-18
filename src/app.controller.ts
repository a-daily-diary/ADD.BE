import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './users/jwt/jwt.guard';
import { CurrentUser } from './common/decorators/current-user.decorator';
import { UserDTO } from './users/dto/user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  setInitDataSet(@CurrentUser() requestUser: UserDTO) {
    return this.appService.setInitDataSet(requestUser);
  }
}
