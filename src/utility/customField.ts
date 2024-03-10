import { DiaryEntity } from 'src/diaries/diaries.entity';

export const generateCustomFieldForDiary = (
  diary: DiaryEntity,
  accessUserId: string,
) => {
  const { author, favorites, bookmarks, deleteAt: _, ...otherInfo } = diary; // FIXME: nest의 classSerializerInterceptor로 처리할 수 있는 방법 고안하기

  const isFavorite = favorites
    .map((favorite) => favorite.user.id)
    .includes(accessUserId);

  const isBookmark = bookmarks
    .map((bookmark) => bookmark.user.id)
    .includes(accessUserId);

  return {
    ...otherInfo,
    isFavorite,
    isBookmark,
    author,
  };
};
