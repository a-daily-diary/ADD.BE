const responseTemplate = (data: any) => {
  return {
    schema: {
      example: {
        success: true,
        data,
      },
    },
  };
};

export const responseExample = {
  // USER
  uploadUserImg: responseTemplate({
    imgUrl: 'url image path',
  }),
  getCurrentUser: responseTemplate({
    id: 'uuid',
    createdAt: 'Data string',
    updateddAt: 'Data string',
    email: 'email string',
    username: 'username string',
    thumbnailUrl: 'url image path',
    isAgree: true,
    isAdmin: false,
  }),
  getUserInfo: responseTemplate({
    id: 'uuid',
    createdAt: 'Data string',
    updateddAt: 'Data string',
    email: 'email string',
    username: 'username string',
    thumbnailUrl: 'url image path',
    isAgree: true,
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
      updateddAt: 'Data string',
      email: 'email string',
      username: 'username string',
      thumbnailUrl: 'url image path',
      isAgree: true,
      isAdmin: false,
    },
  }),

  // DIARY
  getDiaries: responseTemplate([
    {
      token: 'tokenValue',
      user: {
        id: '02797c95-179b-4dfc-9f91-29d8a4292859',
        createdAt: '2023-02-08T15:17:31.103Z',
        updateddAt: '2023-02-08T15:17:31.103Z',
        title: 'test',
        content: 'etsf',
        imgUrl: null,
        favoriteCount: 0,
        commentCount: 0,
        author: {
          id: 'b63d1c3f-9308-4fe4-b9f7-b80c504f3699',
          createdAt: '2023-02-08T11:58:52.163Z',
          updateddAt: '2023-02-08T11:58:52.163Z',
          email: 'woosang@test.com',
          username: 'yws',
          thumbnailUrl: 'http://127.0.0.1:5000',
        },
      },
    },
  ]),
  getDiary: responseTemplate({
    id: '02797c95-179b-4dfc-9f91-29d8a4292859',
    createdAt: '2023-02-08T15:17:31.103Z',
    updateddAt: '2023-02-08T15:17:31.103Z',
    title: 'test',
    content: 'etsf',
    imgUrl: null,
    favoriteCount: 0,
    commentCount: 0,
    author: {
      id: 'b63d1c3f-9308-4fe4-b9f7-b80c504f3699',
      createdAt: '2023-02-08T11:58:52.163Z',
      updateddAt: '2023-02-08T11:58:52.163Z',
      email: 'woosang@test.com',
      username: 'yws',
      thumbnailUrl: 'http://127.0.0.1:5000',
    },
  }),
  createDiary: responseTemplate({
    title: 'qweqwe',
    content: '하하하 공부 열심히 해야되는데...ㅎㅎ',
    author: {
      id: '7879231e-12d9-4184-a9c5-7aacfae9dc12',
      createdAt: '2023-02-12T14:16:41.386Z',
      updateddAt: '2023-02-12T14:16:41.386Z',
      email: 'test@test123.com',
      username: '아무개',
      thumbnailUrl: 'http://127.0.0.1:5000',
    },
    imgUrl: null,
    id: '2db91d6b-47bd-4516-9089-7d5b58bd3271',
    createdAt: '2023-02-16T11:44:54.702Z',
    updateddAt: '2023-02-16T11:44:54.702Z',
    favoriteCount: 0,
    commentCount: 0,
  }),
  updateDiary: responseTemplate({
    id: '2db91d6b-47bd-4516-9089-7d5b58bd3271',
    createdAt: '2023-02-16T11:44:54.702Z',
    updateddAt: '2023-02-16T11:47:52.121Z',
    title: 'test',
    content: '수정되었습니다.',
    imgUrl: null,
    favoriteCount: 0,
    commentCount: 0,
    author: {
      id: '7879231e-12d9-4184-a9c5-7aacfae9dc12',
      createdAt: '2023-02-12T14:16:41.386Z',
      updateddAt: '2023-02-12T14:16:41.386Z',
      email: 'test@test123.com',
      username: '아무개',
      thumbnailUrl: 'http://127.0.0.1:5000',
    },
  }),
  softDeleteDiary: responseTemplate({
    message: '삭제되었습니다.',
  }),
};
