import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoritiesService {
  get() {
    return '좋아요 조회 api';
  }
}
