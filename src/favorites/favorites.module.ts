import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { FavoriteEntity } from './favorites.entity';
import { FavoritesService } from './favorites.service';
import { BadgesModule } from 'src/badges/badges.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntity, FavoriteEntity]),
    BadgesModule,
  ],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
