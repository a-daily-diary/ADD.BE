export enum BadgeCode {
  writer_0 = 'writer_0',
  writer_1 = 'writer_1',
  writer_2 = 'writer_2',
  writer_3 = 'writer_3',
  new_bie = 'new_bie',
  bookmark = 'bookmark',
  heart = 'heart',
  comment = 'comment',
  funny = 'funny',
  greatEnglish = 'greatEnglish',
  manner = 'manner',
  tooMuchTalker = 'tooMuchTalker',
}

export interface BadgeListByUserResponse {
  id: BadgeCode;
  name: string;
  description: string;
  imgUrl: string;
  createdAt: Date;
  updatedAt: Date;
  hasOwn: boolean;
  userToBadge: {
    id: string;
    isPinned: boolean;
    createdAt: Date;
  } | null;
}
