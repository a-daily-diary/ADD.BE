export const favoriteExceptionMessage = {
  DOES_NOT_EXIST_DIARY: '존재하지 않는 게시물입니다.',
  ONLY_ONE_FAVORITE: '접근한 계정은 해당 게시물에 좋아요가 등록되어있습니다.',
  DOES_NOT_REGISTER_FAVORITE:
    '접근한 계정으로 해당 게시물에 좋아요가 등록 되어있지 않아 좋아요 취소가 불가능합니다.',
};

export const diaryExceptionMessage = {
  OWNER_ONLY_EDIT: '일기 작성자만 수정할 수 있습니다.',
  OWNER_ONLY_DELETE: '일기 작성자만 삭제할 수 있습니다.',
  DOES_NOT_EXIST_DIARY: '해당하는 일기가 존재하지 않습니다.',
  INVALID_SORT_BY: "요청하신 'sortBy' 값은 지원되지 않습니다.",
};

export const userExceptionMessage = {
  EXIST_EMAIL: '해당하는 이메일은 이미 존재합니다.',
  EXIST_USERNAME: '해당하는 유저이름이 이미 존재합니다.',
  INCORRECT_LOGIN: '로그인 정보를 확인해주세요.',
  DOES_NOT_EXIST_USER: '해당하는 유저가 존재하지 않습니다.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  INVALID_TOKEN: '유효하지 않은 토큰입니다.',
  INVALID_JWT_TOKEN: '변경하려는 이메일과 토큰 정보가 일치하지 않습니다.',
};

export const bookmarkExceptionMessage = {
  ONLY_ONE_BOOKMARK: '접근한 계정은 해당 게시물에 북마크가 등록되어있습니다.',
  DOES_NOT_REGISTER_BOOKMARK:
    '접근한 계정으로 해당 게시물에 북마크가 등록 되어있지 않아 북마크 취소가 불가능합니다.',
};

export const commentExceptionMessage = {
  DOES_NOT_EXIST_COMMENT: '해당하는 댓글은 존재하지 않습니다.',
  OWNER_ONLY_DELETE:
    '일기 작성자 혹은 댓글 작성자만 해당 댓글을 삭제할 수 있습니다.',
  OWNER_ONLY_EDIT: '댓글 작성자만 해당 댓글을 수정할 수 있습니다.',
};

export const badgeExceptionMessage = {
  DOES_NOT_EXIST_BADGE: '해당하는 뱃지는 존재하지 않습니다.',
  OWNER_ONLY_CREATE: '뱃지 생성은 관리자만 가능합니다.',
  EXIST_BADGE_NAME: '설정하신 뱃지 이름은 이미 존재합니다.',
};

export const userToBadgesExceptionMessage = {
  DOES_NOT_EXIST_USER_TO_BADGE: '해당 뱃지를 획득하지 못했습니다.',
  ONLY_SET_8: '뱃지의 최대 pinned 개수는 8개입니다.',
  OWNER_ONLY_PINNED: '뱃지 소유자만 pinned 할 수 있습니다.',
};

export const termsAgreementExceptionMessage = {
  DOES_NOT_EXIST_TERMS_AGREEMENT: '해당하는 약관동의는 존재하지 않습니다.',
  INVALIDATE_TERMS_AGREEMENTS: '필수 약관동의를 체크해주세요',
};

export const exceptionMessage = {
  ONLY_ADMIN: '해당 API는 관리자 계정만 요청 가능합니다.',
  INCORRECT_KEY: 'incorrect key value',
  INVALID_DATE_FORMAT:
    '데이터 형식이 옳바르지 않습니다. Date 형식(YYYY-MM-DD)에 맞춰 입력해주세요.',
};

export const ActivitiesExceptionMessage = {
  ONLY_YEAR_FORMAT: '연도 포맷의 요청만 가능합니다.',
};

export const matchingHistoryExceptionMessage = {
  DOES_NOT_EXIST_MATCHING_HISTORY: '해당하는 매칭 이력은 존재하지 않습니다.',
};

export const feedbackExceptionMessage = {
  DOES_NOT_EXIST_FEEDBACK: '해당하는 피드백은 존재하지 않습니다.',
};

export const blacklistExceptionMessage = {
  EXIST_BLOCKED_USER: '해당 유저는 블랙리스트에 포함되어 있습니다.',
  DOES_NOT_EXIST_BLACKLIST: '해당 유저는 블랙리스트에 포함되어 있지 않습니다.',
};
