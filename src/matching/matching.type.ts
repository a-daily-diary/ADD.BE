export interface MatchingWaitingUser {
  id: string;
  username: string;
  // blackList: string[]; userId List // TODO: 차후 blacklist 기능 구현 시 추가 예정
}

export interface MatchingSuccessResponse {
  role: 'offer' | 'answer';
  matchingSocket: string;
  matchingUser: string;
}
