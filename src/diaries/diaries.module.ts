import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesModule } from 'src/favorities/favorites.module';
import { DiariesController } from './diaries.controller';
import { DiaryEntity } from './diaries.entity';
import { DiariesService } from './diaries.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity]), FavoritesModule],
  controllers: [DiariesController],
  providers: [DiariesService],
})
export class DiariesModule {}
