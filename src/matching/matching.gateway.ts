import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import {
  MatchingWaitingUser,
  MatchingSuccessResponse,
} from 'src/matching/matching.type';
import { MatchingHistoriesService } from 'src/matching-histories/matching-histories.service';
import { MATCHING_SOCKET_EVENT } from './matching.constants';

@WebSocketGateway({
  namespace: 'matching',
  cors: '*',
})
export class MatchingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly matchingHistoriesService: MatchingHistoriesService,
  ) {}

  @WebSocketServer()
  namespace: Namespace;

  // key = socket id, value = user information
  private matchingQueue: Record<string, MatchingWaitingUser> = {};

  private matchedSocketIds: string[] = [];

  private async matchingJob(matchingQueueSocketIds: string[]) {
    if (matchingQueueSocketIds.length === 0) return;

    for (let i = 0; i < matchingQueueSocketIds.length; i++) {
      // 매칭이 전부 이루어진 경우 반복문 종료
      if (matchingQueueSocketIds.length === this.matchedSocketIds.length) break;

      const offerSocketId = matchingQueueSocketIds[i];

      if (this.matchedSocketIds.includes(offerSocketId)) continue;

      // TODO: BlackList 목록 필터 조건 추가 예정
      const filteredSocketIds = matchingQueueSocketIds.filter(
        (waitingUserSocketId) =>
          waitingUserSocketId !== offerSocketId &&
          this.matchedSocketIds.includes(waitingUserSocketId) === false,
      );

      if (filteredSocketIds.length === 0) continue;

      const randomIndex = Math.floor(Math.random() * filteredSocketIds.length);
      const answerSocketId = filteredSocketIds[randomIndex];

      const offerSocket = this.namespace.sockets.get(offerSocketId);
      const answerSocket = this.namespace.sockets.get(answerSocketId);

      try {
        offerSocket.data.role = 'offer';
        answerSocket.data.role = 'answer';

        offerSocket.emit(MATCHING_SOCKET_EVENT.server.success, {
          role: 'offer',
          socketId: answerSocketId,
          userId: answerSocket.data.userInfo.username,
        } as MatchingSuccessResponse);

        answerSocket.emit(MATCHING_SOCKET_EVENT.server.success, {
          role: 'answer',
          socketId: offerSocketId,
          userId: offerSocket.data.userInfo.username,
        } as MatchingSuccessResponse);

        await this.matchingHistoriesService.create(
          offerSocket.data.userInfo.id,
          answerSocket.data.userInfo.id,
        );

        this.matchedSocketIds.push(offerSocketId);
        this.matchedSocketIds.push(answerSocketId);
      } catch {
        continue; // error가 발생하는 경우 무시하고 다음 반복문 실행
      }
    }

    this.matchedSocketIds.forEach((matchedSocketId) => {
      delete this.matchingQueue[matchedSocketId];
    });

    this.matchedSocketIds = [];
  }

  afterInit() {
    // socket 서버가 구동되었을 때 5초에 한번씩 랜덤 매칭 로직이 수행 됨.
    console.info('Start random matching job.');

    setInterval(() => {
      const matchingQueueSocketIds = Object.keys(this.matchingQueue);

      this.matchingJob(matchingQueueSocketIds);
    }, 5000);
  }

  handleConnection(socket: Socket) {
    socket.on(
      MATCHING_SOCKET_EVENT.client.joinQueue,
      (userInfo: MatchingWaitingUser) => {
        const { id: userId, username } = userInfo;
        this.matchingQueue[socket.id] = { id: userId, username };
        socket.data.userInfo = { id: userId, username };

        console.log(
          `Connection username is ${username} (socket id: ${socket.id})`,
        );
      },
    );
  }

  async handleDisconnect(socket: Socket) {
    const socketData = socket.data;

    if (socketData.role && socketData.role === 'offer') {
      const matchingHistory =
        await this.matchingHistoriesService.findRecentOneByUserId(
          socketData.userInfo.id,
        );

      const matchStartTime = new Date(matchingHistory.createdAt).valueOf();
      const matchEndTime = new Date().valueOf();

      const matchTime = Math.floor((matchEndTime - matchStartTime) / 1000);

      await this.matchingHistoriesService.updateMatchTime(
        matchingHistory.id,
        matchTime,
      );
    }

    console.log(
      `Disconnect username is ${socketData?.userInfo?.username} (socket id: ${socket.id})`,
    );
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    console.log(data);

    socket.emit('message', 'Hello world!');
  }

  @SubscribeMessage(MATCHING_SOCKET_EVENT.client.offer)
  handleOffer(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const { answerSocket, offer } = data;
    socket.to(answerSocket).emit(MATCHING_SOCKET_EVENT.server.offer, offer);
  }

  @SubscribeMessage(MATCHING_SOCKET_EVENT.client.answer)
  handleAnswer(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const { offerSocket, answer } = data;
    socket.to(offerSocket).emit(MATCHING_SOCKET_EVENT.server.answer, answer);
  }

  @SubscribeMessage(MATCHING_SOCKET_EVENT.client.ice)
  handleIce(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const { matchingSocket, candidate } = data;
    socket.to(matchingSocket).emit(MATCHING_SOCKET_EVENT.server.ice, candidate);
  }
}
