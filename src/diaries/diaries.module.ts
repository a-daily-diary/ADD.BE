import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiariesController } from './diaries.controller';
import { DiaryEntity } from './diaries.entity';
import { DiariesService } from './diaries.service';
import { FavoriteEntity } from './favorites.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity, FavoriteEntity])],
  controllers: [DiariesController],
  providers: [DiariesService],
})
export class DiariesModule {}
