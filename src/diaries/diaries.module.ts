import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritiesModule } from 'src/favorities/favorities.module';
import { DiariesController } from './diaries.controller';
import { DiaryEntity } from './diaries.entity';
import { DiariesService } from './diaries.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity]), FavoritiesModule],
  controllers: [DiariesController],
  providers: [DiariesService],
})
export class DiariesModule {}
