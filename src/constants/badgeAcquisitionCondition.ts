import { BadgeAcquisitionCondition, BadgeCode } from 'src/types/badges.type';

export const BadgeAcquisitionConditionForDiary: BadgeAcquisitionCondition[] = [
  {
    conditionCount: 1,
    badgeCode: BadgeCode.writer_0,
  },
  {
    conditionCount: 10,
    badgeCode: BadgeCode.writer_1,
  },
];

export const BadgeAcquisitionConditionForComment: BadgeAcquisitionCondition[] =
  [
    {
      conditionCount: 10,
      badgeCode: BadgeCode.comment,
    },
  ];

export const BadgeAcquisitionConditionForFavorite: BadgeAcquisitionCondition[] =
  [
    {
      conditionCount: 10,
      badgeCode: BadgeCode.heart,
    },
  ];

export const BadgeAcquisitionConditionForBookmark: BadgeAcquisitionCondition[] =
  [
    {
      conditionCount: 10,
      badgeCode: BadgeCode.bookmark,
    },
  ];
