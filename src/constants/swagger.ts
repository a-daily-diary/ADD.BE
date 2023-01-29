export const responseExample = {
  uploadUserImg: {
    schema: {
      example: {
        imgUrl: 'http://127.0.0.1:5002/media/users/cat1674975472135.jpeg',
      },
    },
  },
  getCurrentUser: {
    schema: {
      example: {
        id: '4af88b68-2778-4561-933e-3d86a1f6ba87',
        createdAt: '2023-01-29T06:39:19.232Z',
        updateddAt: '2023-01-29T06:39:19.232Z',
        email: 'woosang@test.com',
        username: 'yws',
        thumbnailUrl: 'http://127.0.0.1:5000',
        isAgree: true,
        isAdmin: false,
      },
    },
  },
  getUserInfo: {
    schema: {
      example: {
        id: '4af88b68-2778-4561-933e-3d86a1f6ba87',
        createdAt: '2023-01-29T06:39:19.232Z',
        updateddAt: '2023-01-29T06:39:19.232Z',
        email: 'woosang@test.com',
        username: 'yws',
        thumbnailUrl: 'http://127.0.0.1:5000',
        isAgree: true,
        isAdmin: false,
      },
    },
  },
  join: {
    schema: {
      example: {
        message: '회원가입에 성공하였습니다.',
      },
    },
  },
  emailCheck: {
    schema: {
      example: {
        message: '사용가능한 이메일입니다.',
      },
    },
  },
  usernameCheck: {
    schema: {
      example: {
        message: '사용가능한 유저이름입니다.',
      },
    },
  },
  login: {
    schema: {
      example: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0YWY4OGI2OC0yNzc4LTQ1NjEtOTMzZS0zZDg2YTFmNmJhODciLCJpYXQiOjE2NzQ5NzQzNzQsImV4cCI6MTY3NTA2MDc3NH0.7qoTypzUQTfIULMoKPLYpXOcpTVtQZcsMKjdSnHRT2U',
        user: {
          id: '4af88b68-2778-4561-933e-3d86a1f6ba87',
          createdAt: '2023-01-29T06:39:19.232Z',
          updateddAt: '2023-01-29T06:39:19.232Z',
          email: 'woosang@test.com',
          username: 'yws',
          thumbnailUrl: 'http://127.0.0.1:5000',
          isAgree: true,
          isAdmin: false,
        },
      },
    },
  },
};
