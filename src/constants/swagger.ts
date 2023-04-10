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

export const responseExampleForUser = {
  uploadUserImg: responseTemplate({
    imgUrl: 'url image path',
  }),
  getCurrentUser: responseTemplate({
    id: 'uuid',
    createdAt: 'Data string',
    updatedAt: 'Data string',
    email: 'email string',
    username: 'username string',
    thumbnailUrl: 'url image path',
    isAgree: true,
    isAdmin: false,
  }),
  getAllUsers: responseTemplate([
    {
      id: 'b63d1c3f-9308-4fe4-b9f7-b80c504f3699',
      createdAt: '2023-02-08T11:58:52.163Z',
      updatedAt: '2023-02-08T11:58:52.163Z',
      email: 'woosang@test.com',
      username: 'yws',
      thumbnailUrl: 'http://127.0.0.1:5000',
      isAdmin: false,
    },
  ]),
  getUserInfo: responseTemplate({
    id: 'uuid',
    createdAt: 'Data string',
    updatedAt: 'Data string',
    email: 'email string',
    username: 'username string',
    thumbnailUrl: 'url image path',
    isAdmin: false,
  }),
  join: responseTemplate({
    message: '회원가입에 성공하였습니다.',
  }),
  emailCheck: responseTemplate({
    message: '사용가능한 이메일입니다.',
  }),
  usernameCheck: responseTemplate({
    message: '사용가능한 유저이름입니다.',
  }),
  login: responseTemplate({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0YWY4OGI2OC0yNzc4LTQ1NjEtOTMzZS0zZDg2YTFmNmJhODciLCJpYXQiOjE2NzQ5NzQzNzQsImV4cCI6MTY3NTA2MDc3NH0.7qoTypzUQTfIULMoKPLYpXOcpTVtQZcsMKjdSnHRT2U',
    user: {
      id: 'uuid',
      createdAt: 'Data string',
      updatedAt: 'Data string',
      email: 'email string',
      username: 'username string',
      thumbnailUrl: 'url image path',
      isAdmin: false,
    },
  }),
};

export const responseExampleForDiary = {
  uploadDiaryImg: responseTemplate({
    imgUrl: 'url image path',
  }),
  getDiaries: responseTemplate([
    {
      id: '02797c95-179b-4dfc-9f91-29d8a4292859',
      createdAt: '2023-02-08T15:17:31.103Z',
      updatedAt: '2023-02-08T15:17:31.103Z',
      title: 'test',
      content: 'etsf',
      imgUrl: null,
      favoriteCount: 0,
      commentCount: 0,
      isFavorite: true,
      isBookmark: false,
      author: {
        id: 'b63d1c3f-9308-4fe4-b9f7-b80c504f3699',
        createdAt: '2023-02-08T11:58:52.163Z',
        updatedAt: '2023-02-08T11:58:52.163Z',
        email: 'woosang@test.com',
        username: 'yws',
        thumbnailUrl: 'http://127.0.0.1:5000',
        isAgree: true,
        isAdmin: false,
      },
    },
  ]),
  getDiary: responseTemplate({
    id: '02797c95-179b-4dfc-9f91-29d8a4292859',
    createdAt: '2023-02-08T15:17:31.103Z',
    updatedAt: '2023-02-08T15:17:31.103Z',
    title: 'test',
    content: 'etsf',
    imgUrl: null,
    favoriteCount: 0,
    commentCount: 0,
    isFavorite: true,
    isBookmark: false,
    author: {
      id: 'b63d1c3f-9308-4fe4-b9f7-b80c504f3699',
      createdAt: '2023-02-08T11:58:52.163Z',
      updatedAt: '2023-02-08T11:58:52.163Z',
      email: 'woosang@test.com',
      username: 'yws',
      thumbnailUrl: 'http://127.0.0.1:5000',
      isAgree: true,
      isAdmin: false,
    },
  }),
  getDiariesByUsersBookmark: responseTemplate([
    {
      id: '926cc4a2-df70-4566-ae40-e6862c72dd78',
      createdAt: '2023-03-02T14:36:37.157Z',
      updatedAt: '2023-03-11T03:48:37.015Z',
      title: 'qweqwe',
      content: '하하하 공부 열심히 해야되는데...ㅎㅎ',
      imgUrl: null,
      favoriteCount: 1,
      commentCount: 0,
      isFavorite: false,
      isBookmark: true,
      author: {
        id: '3affee04-e5d8-471d-a666-9310e05e1b6e',
        createdAt: '2023-03-02T14:36:03.062Z',
        updatedAt: '2023-03-02T14:36:03.062Z',
        email: 'test@test.com',
        username: 'test',
        thumbnailUrl: 'http://127.0.0.1:5000',
        isAgree: true,
        isAdmin: false,
      },
    },
  ]),
  createDiary: responseTemplate({
    title: 'qweqwe',
    content: '하하하 공부 열심히 해야되는데...ㅎㅎ',
    author: {
      id: '7879231e-12d9-4184-a9c5-7aacfae9dc12',
      createdAt: '2023-02-12T14:16:41.386Z',
      updatedAt: '2023-02-12T14:16:41.386Z',
      email: 'test@test123.com',
      username: '아무개',
      thumbnailUrl: 'http://127.0.0.1:5000',
      isAgree: true,
      isAdmin: false,
    },
    imgUrl: null,
    id: '2db91d6b-47bd-4516-9089-7d5b58bd3271',
    createdAt: '2023-02-16T11:44:54.702Z',
    updatedAt: '2023-02-16T11:44:54.702Z',
    favoriteCount: 0,
    commentCount: 0,
  }),
  updateDiary: responseTemplate({
    id: '2db91d6b-47bd-4516-9089-7d5b58bd3271',
    createdAt: '2023-02-16T11:44:54.702Z',
    updatedAt: '2023-02-16T11:47:52.121Z',
    title: 'test',
    content: '수정되었습니다.',
    imgUrl: null,
    favoriteCount: 0,
    commentCount: 0,
    author: {
      id: '7879231e-12d9-4184-a9c5-7aacfae9dc12',
      createdAt: '2023-02-12T14:16:41.386Z',
      updatedAt: '2023-02-12T14:16:41.386Z',
      email: 'test@test123.com',
      username: '아무개',
      thumbnailUrl: 'http://127.0.0.1:5000',
      isAgree: true,
      isAdmin: false,
    },
  }),
  softDeleteDiary: responseTemplate({
    message: '삭제되었습니다.',
  }),
};

export const responseExampleForFavorite = {
  createFavorite: responseTemplate({
    author: {
      id: 'd50d5458-dadf-4d29-b487-d64f75cca1d8',
      createdAt: '2023-03-01T08:37:09.283Z',
      updatedAt: '2023-03-01T08:37:09.283Z',
      email: 'test@test6.com',
      username: 'test6',
      thumbnailUrl: 'http://127.0.0.1:5000',
      isAgree: true,
      isAdmin: false,
    },
    diary: {
      id: '5528612e-2e34-478e-b300-235d27738cde',
      createdAt: '2023-02-22T13:33:03.898Z',
      updatedAt: '2023-03-01T08:35:53.473Z',
      title: 'qweqwe',
      content: '하하하 공부 열심히 해야되는데...ㅎㅎ',
      imgUrl: null,
      favoriteCount: 9,
      commentCount: 0,
    },
    id: 'd5bee6d3-0d5d-4572-a1a0-bc31dcb4acc7',
    createdAt: '2023-03-01T08:37:20.062Z',
    updatedAt: '2023-03-01T08:37:20.062Z',
  }),
  deleteFavorite: responseTemplate({
    message: '취소 되었습니다.',
  }),
};

export const responseExampleForBookmark = {
  registerBookmark: responseTemplate({
    message: '북마크가 등록되었습니다..',
  }),
  unregisterBookmark: responseTemplate({
    message: '취소 되었습니다.',
  }),
};
