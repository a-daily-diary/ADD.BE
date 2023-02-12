export const responseExample = {
  uploadUserImg: {
    schema: {
      example: {
        success: true,
        data: {
          imgUrl: 'url image path',
        },
      },
    },
  },
  getCurrentUser: {
    schema: {
      example: {
        success: true,
        data: {
          id: 'uuid',
          createdAt: 'Data string',
          updateddAt: 'Data string',
          email: 'email string',
          username: 'username string',
          thumbnailUrl: 'url image path',
          isAgree: true,
          isAdmin: false,
        },
      },
    },
  },
  getUserInfo: {
    schema: {
      example: {
        success: true,
        data: {
          id: 'uuid',
          createdAt: 'Data string',
          updateddAt: 'Data string',
          email: 'email string',
          username: 'username string',
          thumbnailUrl: 'url image path',
          isAgree: true,
          isAdmin: false,
        },
      },
    },
  },
  join: {
    schema: {
      example: {
        success: true,
        data: {
          message: '회원가입에 성공하였습니다.',
        },
      },
    },
  },
  emailCheck: {
    schema: {
      example: {
        success: true,
        data: {
          message: '사용가능한 이메일입니다.',
        },
      },
    },
  },
  usernameCheck: {
    schema: {
      example: {
        success: true,
        data: {
          message: '사용가능한 유저이름입니다.',
        },
      },
    },
  },
  login: {
    schema: {
      example: {
        success: true,
        data: {
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
        },
      },
    },
  },
};
