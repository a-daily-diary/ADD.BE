import { BadgeFormDTO } from 'src/badges/dto/badge-form.dto';
import { BadgeCode } from 'src/types/badges.type';

export const steady0Badge: BadgeFormDTO = {
  id: BadgeCode.steady_0,
  name: '새싹 디디',
  imgUrl: 'http://add.bucket.s3.amazonaws.com/badges/steady/steady_0.png',
  description: '첫 일기 작성',
};

export const steady1Badge: BadgeFormDTO = {
  id: BadgeCode.steady_1,
  name: '잎새 디디',
  imgUrl: 'http://add.bucket.s3.amazonaws.com/badges/steady/steady_1.png',
  description: '일기 10회 작성',
};

export const steady2Badge: BadgeFormDTO = {
  id: BadgeCode.steady_2,
  name: '소나무 디디',
  imgUrl: 'http://add.bucket.s3.amazonaws.com/badges/steady/steady_2.png',
  description: '일기 50회 작성',
};

export const steady3Badge: BadgeFormDTO = {
  id: BadgeCode.steady_3,
  name: '꾸준한 디디',
  imgUrl: 'http://add.bucket.s3.amazonaws.com/badges/steady/steady_3.png',
  description: '일기 100회 작성',
};

export const newBieBadge: BadgeFormDTO = {
  id: BadgeCode.new_bie,
  name: '디디의 첫걸음',
  imgUrl: 'http://add.bucket.s3.amazonaws.com/badges/steady/new_bie.png',
  description: '기본 thumbnail 변경',
};

export const bookmarkBadge: BadgeFormDTO = {
  id: BadgeCode.bookmark,
  name: '일기 수집가',
  imgUrl: 'http://add.bucket.s3.amazonaws.com/badges/steady/bookmark.png',
  description: '북마크 10회 등록',
};

export const heartBadge: BadgeFormDTO = {
  id: BadgeCode.heart,
  name: '응원의 하트',
  imgUrl: 'http://add.bucket.s3.amazonaws.com/badges/steady/heart.png',
  description: '하트 10회 등록',
};

export const commentBadge: BadgeFormDTO = {
  id: BadgeCode.comment,
  name: '리액션 부자',
  imgUrl: 'http://add.bucket.s3.amazonaws.com/badges/steady/comment.png',
  description: '댓글 10회 작성',
};
