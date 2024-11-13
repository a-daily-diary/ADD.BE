export interface MatchingWaitingUser {
  id: string;
  username: string;
  blockedUserIdList: string[];
}

export interface MatchingSuccessResponse {
  role: 'offer' | 'answer';
  socketId: string;
  userId: string;
}
