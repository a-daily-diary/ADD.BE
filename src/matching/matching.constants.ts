export const MATCHING_SOCKET_EVENT = {
  client: {
    joinQueue: 'joinQueue',
    offer: 'offer',
    answer: 'answer',
    ice: 'ice',
  },
  server: {
    success: 'success',
    offer: 'offer',
    answer: 'answer',
    ice: 'ice',
  },
} as const;
