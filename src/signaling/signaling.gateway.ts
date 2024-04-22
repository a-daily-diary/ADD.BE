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
import { MatchingWaitingUser } from 'src/signaling/signaling.type';

@WebSocketGateway({
  namespace: 'signaling',
  cors: '*',
})
export class SignalingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  namespace: Namespace;

  // FIXME: matchingWaitingUserObject에서 BlackList를 관리할지 아니면 user의 id로 DB에 직접 조회할지 고민 필요
  private matchingWaitingUserObject: Record<string, MatchingWaitingUser> = {};

  private WAITING_ROOM = 'WAITING_ROOM';

  afterInit() {
    // socket 서버가 구동되었을 때 5초에 한번씩 랜덤 매칭 로직이 수행 됨.
    console.log('Start random matching job.');
  }

  handleConnection(socket: Socket) {
    socket.join(this.WAITING_ROOM);

    socket.on('userInfo', (userInfo: MatchingWaitingUser) => {
      console.log(
        `Connection username is ${userInfo.username} (socket id: ${socket.id})`,
      );
      this.matchingWaitingUserObject[socket.id] = userInfo;
    });
  }

  handleDisconnect(socket: Socket) {
    console.log(
      `Disconnect username is ${
        this.matchingWaitingUserObject[socket.id].username
      } (socket id: ${socket.id})`,
    );
    delete this.matchingWaitingUserObject[socket.id];
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    console.log(data);

    socket.emit('message', 'Hello world!');
  }
}
