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

export const responseExampleForUser = {
  uploadUserImg: responseTemplate({
    imgUrl: 'url image path',
  }),
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
  getCurrentUser: responseTemplate(userResponse),
  getUserInfo: responseTemplate({
    ...userResponse,
    diaries: [diaryResponse],
  }),
  getAllUsers: responseTemplate([userResponse]),
};

export const responseExampleForDiary = {
  uploadDiaryImg: responseTemplate({
    imgUrl: 'url image path',
  }),
  createDiary: responseTemplate({
    ...diaryResponse,
    author: userResponse,
  }),
  getDiaries: responseTemplate([
    {
      ...diaryResponse,
      isFavorite: 'boolean',
      isBookmark: 'boolean',
      author: userResponse,
    },
  ]),
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
  softDeleteDiary: responseTemplate({
    message: '삭제되었습니다.',
  }),
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
