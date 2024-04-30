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
import { MatchingWaitingUser } from 'src/matching/matching.type';

@WebSocketGateway({
  namespace: 'matching',
  cors: '*',
})
export class MatchingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  namespace: Namespace;

  // key = socket id, value = user information
  private matchingQueue: Record<string, MatchingWaitingUser> = {};

  private matchedSocketIds: string[] = [];

  afterInit() {
    // socket 서버가 구동되었을 때 5초에 한번씩 랜덤 매칭 로직이 수행 됨.
    console.log('Start random matching job.');

    setInterval(() => {
      const matchingQueueSocketIds = Object.keys(this.matchingQueue);

      if (matchingQueueSocketIds.length === 0) return;

      for (let i = 0; i < matchingQueueSocketIds.length; i++) {
        if (matchingQueueSocketIds.length === this.matchedSocketIds.length)
          break;

        const offerSocketId = matchingQueueSocketIds[i];

        if (this.matchedSocketIds.includes(offerSocketId)) continue;

        // TODO: BlackList 목록 필터 조건 추가 예정
        const filteredSocketIds = matchingQueueSocketIds.filter(
          (waitingUserSocketId) =>
            waitingUserSocketId !== offerSocketId &&
            this.matchedSocketIds.includes(waitingUserSocketId) === false,
        );

        if (filteredSocketIds.length === 0) continue;

        const randomIndex = Math.floor(
          Math.random() * filteredSocketIds.length,
        );

        const answerSocketId = filteredSocketIds[randomIndex];

        this.matchedSocketIds.push(offerSocketId);
        this.matchedSocketIds.push(answerSocketId);

        // TODO: Matching 작업 수행
      }

      this.matchedSocketIds.forEach((matchedSocketId) => {
        delete this.matchingQueue[matchedSocketId];
      });

      this.matchedSocketIds = [];
    }, 5000);
  }

  handleConnection(socket: Socket) {
    socket.on('userInfo', (userInfo: MatchingWaitingUser) => {
      console.log(
        `Connection username is ${userInfo.username} (socket id: ${socket.id})`,
      );
      this.matchingQueue[socket.id] = userInfo;
    });
  }

  handleDisconnect(socket: Socket) {
    console.log(
      `Disconnect username is ${
        this.matchingQueue[socket.id]?.username
      } (socket id: ${socket.id})`,
    );
    delete this.matchingQueue[socket.id];
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    console.log(data);

    socket.emit('message', 'Hello world!');
  }
}
