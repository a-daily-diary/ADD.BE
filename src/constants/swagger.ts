const responseTemplate = (data) => {
  return {
    schema: {
      example: {
        success: true,
        data,
      },
    },
  };
};

const userResponse = {
  id: 'uuid',
  email: 'email string',
  username: 'username string',
  imgUrl: 'url image path',
  isAdmin: 'boolean',
};

const diaryResponse = {
  id: 'uuid',
  createdAt: '2023-04-10T13:22:32.362Z',
  updatedAt: '2023-04-10T13:27:16.887Z',
  title: 'string',
  content: 'text',
  imgUrl: 'null | string',
  favoriteCount: 'number',
  commentCount: 'number',
};

const badgeResponse = {
  id: 'uuid',
  createdAt: '2023-05-07T07:33:03.418Z',
  updatedAt: '2023-05-07T07:33:03.418Z',
  name: 'string',
  description: 'text',
  imgUrl: 'url image path',
};

const termsAgreementResponse = {
  id: 'number',
  title: 'string',
  content: 'string',
  isRequired: 'boolean',
};

const deleteResponse = {
  message: '삭제되었습니다.',
};

export const responseExampleForCommon = {
  uploadImg: responseTemplate({
    imgUrl: 'url image path',
  }),
};

export const responseExampleForUser = {
  emailCheck: responseTemplate({
    message: '사용가능한 이메일입니다.',
  }),
  usernameCheck: responseTemplate({
    message: '사용가능한 유저이름입니다.',
  }),
  join: responseTemplate({
    message: '회원가입에 성공하였습니다.',
  }),
  login: responseTemplate({
    token: 'token',
    user: userResponse,
  }),
  getDefaultThumbnail: responseTemplate({
    thumbnailList: [
      {
        fileName: 'dd_blue.PNG',
        path: 'http://add.bucket.s3.amazonaws.com/default/dd_blue.PNG',
      },
      {
        fileName: 'dd_green.PNG',
        path: 'http://add.bucket.s3.amazonaws.com/default/dd_green.PNG',
      },
      {
        fileName: 'dd_red.PNG',
        path: 'http://add.bucket.s3.amazonaws.com/default/dd_red.PNG',
      },
    ],
  }),
  getCurrentUser: responseTemplate(userResponse),
  getUserInfo: responseTemplate(userResponse),
  getAllUsers: responseTemplate([userResponse]),
};

export const responseExampleForDiary = {
  createDiary: responseTemplate({
    ...diaryResponse,
    author: userResponse,
  }),
  getDiaries: responseTemplate({
    diaries: [
      {
        ...diaryResponse,
        isFavorite: 'boolean',
        isBookmark: 'boolean',
        author: userResponse,
      },
    ],
    totalCount: 'number',
    totalPage: 'number',
  }),
  getDiary: responseTemplate({
    ...diaryResponse,
    isFavorite: 'boolean',
    isBookmark: 'boolean',
    author: userResponse,
  }),
  getDiariesByUsersBookmark: responseTemplate([
    {
      ...diaryResponse,
      isFavorite: 'boolean',
      isBookmark: 'boolean',
      author: userResponse,
    },
  ]),
  updateDiary: responseTemplate({
    ...diaryResponse,
    isFavorite: 'boolean',
    isBookmark: 'boolean',
    author: userResponse,
  }),
  softDeleteDiary: responseTemplate(deleteResponse),
};

export const responseExampleForFavorite = {
  registerFavorite: responseTemplate({
    message: '좋아요가 등록되었습니다.',
  }),
  unregisterFavorite: responseTemplate({
    message: '좋아요 등록이 취소되었습니다.',
  }),
};

export const responseExampleForBookmark = {
  registerBookmark: responseTemplate({
    message: '북마크가 등록되었습니다.',
  }),
  unregisterBookmark: responseTemplate({
    message: '북마크 등록이 취소되었습니다.',
  }),
};

export const responseExampleForComment = {
  createComment: responseTemplate({
    id: 'uuid',
    createdAt: '2023-04-22T10:24:58.188Z',
    updatedAt: '2023-04-22T10:24:58.188Z',
    comment: 'text',
    commenter: userResponse,
    diary: diaryResponse,
  }),
  getCommentList: responseTemplate({
    comments: [
      {
        id: 'uuid',
        createdAt: '2023-04-23T03:29:33.979Z',
        updatedAt: '2023-04-23T03:29:33.979Z',
        comment: 'text',
        commenter: userResponse,
      },
    ],
    totalCount: 'number',
    totalPage: 'number',
  }),
  updateComment: responseTemplate({
    id: 'uuid',
    createdAt: '2023-04-22T10:24:58.188Z',
    updatedAt: '2023-04-22T10:24:58.188Z',
    comment: 'text',
    commenter: userResponse,
  }),
  deleteComment: responseTemplate(deleteResponse),
};

export const responseExampleForBadge = {
  createBadge: responseTemplate(badgeResponse),
  getBadgeList: responseTemplate({
    badges: [badgeResponse],
    totalCount: 'number',
    totalPage: 'number',
  }),
  getBadge: responseTemplate(badgeResponse),
  updateBadge: responseTemplate(badgeResponse),
  deleteBadge: responseTemplate(deleteResponse),
};

export const responseExampleForTermsAgreement = {
  createTermsAgreement: responseTemplate(termsAgreementResponse),
  getTermsAgreementList: responseTemplate([termsAgreementResponse]),
  getTermsAgreement: responseTemplate(termsAgreementResponse),
  deleteTermsAgreement: responseTemplate(deleteResponse),
};
