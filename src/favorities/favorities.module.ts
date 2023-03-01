import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { FavoriteEntity } from './favorites.entity';
import { FavoritiesService } from './favorities.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntity, FavoriteEntity])],
  providers: [FavoritiesService],
  exports: [FavoritiesService],
})
export class FavoritiesModule {}
