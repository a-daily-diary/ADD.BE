export enum BadgeCode {
  steady_0 = 'steady_0',
  steady_1 = 'steady_1',
  steady_2 = 'steady_2',
  steady_3 = 'steady_3',
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

export interface BadgeAcquisitionCondition {
  conditionCount: number;
  badgeCode: BadgeCode;
}
