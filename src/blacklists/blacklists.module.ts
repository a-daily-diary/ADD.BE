import { Module } from '@nestjs/common';
import { BlacklistsController } from './blacklists.controller';
import { BlacklistsService } from './blacklists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistEntity } from './blacklist.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlacklistEntity]), UsersModule],
  controllers: [BlacklistsController],
  providers: [BlacklistsService],
})
export class BlacklistsModule {}
