import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/diaries/diaries.entity';
import { FavoriteEntity } from './favorites.entity';
import { FavoritesService } from './favorites.service';
import { UserToBadgesModule } from 'src/user-to-badges/user-to-badges.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntity, FavoriteEntity]),
    UserToBadgesModule,
  ],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
