const responseTemplate = <T>(data: T) => {
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
  createdAt: 'Date(string)',
  updatedAt: 'Date(string)',
  title: 'string',
  content: 'text',
  imgUrl: 'null | string',
  isPublic: 'boolean',
  favoriteCount: 'number',
  commentCount: 'number',
  isFavorite: false,
  isBookmark: false,
  author: userResponse,
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

const matchingHistoryResponse = {
  basic: {
    id: 'uuid',
    matchTime: 'number',
    createdAt: 'date',
  },
  raw: {
    id: 'uuid',
    matchTime: 'number',
    user1: userResponse,
    user2: userResponse,
    createdAt: 'date',
  },
  familiar: {
    id: 'uuid',
    matchTime: 'number',
    matchedUser: userResponse,
    createdAt: 'date',
  },
};

const feedbackResponse = {
  create: {
    isNice: 'boolean',
    isFluent: 'boolean',
    isFun: 'boolean',
    isBad: 'boolean',
    content: 'text',
    id: 'uuid',
    createdAt: 'date',
    updatedAt: 'date',
    writer: userResponse,
    recipient: userResponse,
    matchingHistory: matchingHistoryResponse.basic,
  },
  short: {
    isNice: 'boolean',
    isFluent: 'boolean',
    isFun: 'boolean',
    isBad: 'boolean',
    content: 'text',
    id: 'uuid',
    createdAt: 'date',
    updatedAt: 'date',
  },
  detail: {
    isNice: 'boolean',
    isFluent: 'boolean',
    isFun: 'boolean',
    isBad: 'boolean',
    content: 'text',
    writer: userResponse,
    recipient: userResponse,
    matchingHistory: matchingHistoryResponse.raw,
    id: 'uuid',
    createdAt: 'date',
    updatedAt: 'date',
  },
};

const conversationTopicResponse = {
  id: 'uuid',
  topicEn: 'string',
  topicKr: 'string',
  phraseEn: 'string',
  phraseKr: 'string',
  createdAt: 'date',
  updatedAt: 'date',
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
  sendPasswordResetLink: responseTemplate({
    message: '비밀번호 재설정 메일이 발송되었습니다.',
  }),
  passwordReset: responseTemplate({
    message: '비밀번호가 재설정되었습니다.',
  }),
  tempTokenValidation: responseTemplate({
    isValidate: 'boolean',
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
  getDiariesByUsersBookmark: responseTemplate({
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

export const responseExampleForActivities = {
  graphData: responseTemplate([{ date: 'Date', activityCount: 'number' }]),
  getUserActivity: responseTemplate({
    date: 'date',
    activityCount: 'number',
    activities: {
      diaries: [diaryResponse],
    },
    diaryCount: 'number',
    commentCount: 'number',
    randomMatchingCount: 'number',
  }),
};

export const responseExampleForMatchingHistory = {
  createMatchingHistory: responseTemplate(matchingHistoryResponse.raw),
  updateMatchingHistory: responseTemplate(matchingHistoryResponse.raw),
  getRecentMatchingHistory: responseTemplate(matchingHistoryResponse.familiar),
  getMatchingHistories: responseTemplate([matchingHistoryResponse.raw]),
  deleteMatchingHistory: responseTemplate(deleteResponse),
};

export const responseExampleForFeedback = {
  create: responseTemplate(feedbackResponse.create),
  getFeedbackList: responseTemplate({
    detail_false_example: {
      feedbackList: [feedbackResponse.short],
      totalCount: 'number',
    },
    detail_true_example: {
      feedbackList: [feedbackResponse.detail],
      totalCount: 'number',
    },
  }),
  delete: responseTemplate(deleteResponse),
};

export const responseExampleForBlacklist = {
  create: responseTemplate({
    owner: userResponse,
    blockedUser: userResponse,
    id: 'uuid',
    createdAt: 'date string',
    updatedAt: 'date string',
  }),
  getBlockedUserList: responseTemplate([userResponse]),
  delete: responseTemplate(deleteResponse),
};

export const responseExampleForConversationTopic = {
  create: responseTemplate(conversationTopicResponse),
  list: responseTemplate({
    list: [conversationTopicResponse],
    totalCount: 'number',
  }),
  update: responseTemplate(conversationTopicResponse),
};
