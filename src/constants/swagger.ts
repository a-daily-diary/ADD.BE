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
  title: 'string',
  content: 'text',
  imgUrl: 'null | string',
  isPublic: 'boolean',
  favoriteCount: 'number',
  commentCount: 'number',
  createdAt: 'Date(string)',
  updatedAt: 'Date(string)',
};

const commentResponse = {
  id: 'uuid',
  createdAt: 'Date(string)',
  updatedAt: 'Date(string)',
  comment: 'text',
  commenter: userResponse,
};

const badgeResponse = {
  id: 'writer_0 | writer_1 | writer_2 | writer_3 | new_bie | bookmark | heart | comment | funny | greatEnglish | manner | tooMuchTalker',
  name: 'string',
  description: 'text',
  imgUrl: 'url image path',
  createdAt: 'Date(string)',
  updatedAt: 'Date(string)',
};

const userToBadgeResponse = {
  id: 'uuid',
  isPinned: 'boolean',
  createdAt: 'Date(string)',
};

const termsAgreementResponse = {
  id: 'service | privacy | marketing',
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
  emailExists: responseTemplate({
    message: '사용가능한 이메일입니다.',
  }),
  usernameExists: responseTemplate({
    message: '사용가능한 유저이름입니다.',
  }),
  register: responseTemplate({
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
    diary: {
      ...diaryResponse,
      author: userResponse,
    },
    badge: badgeResponse || null,
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
    badge: badgeResponse,
  }),
  unregisterFavorite: responseTemplate({
    message: '좋아요 등록이 취소되었습니다.',
  }),
};

export const responseExampleForBookmark = {
  registerBookmark: responseTemplate({
    message: '북마크가 등록되었습니다.',
    badge: badgeResponse,
  }),
  unregisterBookmark: responseTemplate({
    message: '북마크 등록이 취소되었습니다.',
  }),
};

export const responseExampleForComment = {
  createComment: responseTemplate({
    comment: {
      ...commentResponse,
      diary: diaryResponse,
    },
    badge: badgeResponse,
  }),
  getCommentList: responseTemplate({
    comments: [commentResponse],
    totalCount: 'number',
    totalPage: 'number',
  }),
  updateComment: responseTemplate(commentResponse),
  deleteComment: responseTemplate(deleteResponse),
};

export const responseExampleForBadge = {
  createBadge: responseTemplate(badgeResponse),
  getBadgeList: responseTemplate([
    {
      ...badgeResponse,
      userToBadges: [
        {
          ...userToBadgeResponse,
          user: userResponse,
        },
      ],
    },
  ]),
  getBadge: responseTemplate(badgeResponse),
  getBadgeListByUsername: responseTemplate({
    ...badgeResponse,
    hasOwn: 'boolean',
    userToBadge: {
      id: 'uuid',
      isPinned: 'boolean',
      createdAt: 'Date(string)',
    },
  }),
  updateBadge: responseTemplate(badgeResponse),
  deleteBadge: responseTemplate(deleteResponse),
  pinnedBadge: responseTemplate(userToBadgeResponse),
};

export const responseExampleForTermsAgreement = {
  createTermsAgreement: responseTemplate(termsAgreementResponse),
  getTermsAgreementList: responseTemplate([termsAgreementResponse]),
  getTermsAgreement: responseTemplate(termsAgreementResponse),
  deleteTermsAgreement: responseTemplate(deleteResponse),
};

export const responseExampleForHeatmap = {
  graphData: responseTemplate([{ date: 'Date', activityCount: 'number' }]),
};
