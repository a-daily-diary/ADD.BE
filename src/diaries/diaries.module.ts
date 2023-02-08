import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiariesController } from './diaries.controller';
import { DiaryEntity } from './diaries.entity';
import { DiariesService } from './diaries.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity])],
  controllers: [DiariesController],
  providers: [DiariesService],
})
export class DiariesModule {}
