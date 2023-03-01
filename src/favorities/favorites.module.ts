import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { FavoriteEntity } from './favorites.entity';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity, FavoriteEntity])],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
