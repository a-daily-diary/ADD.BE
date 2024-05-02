import { DiarySortBy } from './diaries.type';

export const sortByConverter: Record<DiarySortBy, string> = {
  popularity: 'favoriteCount',
  latest: 'createdAt',
  comments: 'commentCount',
};
