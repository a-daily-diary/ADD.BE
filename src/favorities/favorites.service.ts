import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoritesService {
  get() {
    return '좋아요 조회 api';
  }
}
