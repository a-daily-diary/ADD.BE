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
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'signaling',
  cors: '*',
})
export class SignalingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private sockets: Record<string, Socket> = {};

  afterInit() {
    console.log('signaling server is up.');
  }

  handleConnection(socket: Socket) {
    console.log(`### connection new user ${socket.id} ###`);

    this.sockets[socket.id] = socket;

    socket.emit('welcome', socket.id);
  }

  handleDisconnect(socket: Socket) {
    console.log(`### disconnect user ${socket.id} ###`);

    delete this.sockets[socket.id];
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    console.log(data);

    socket.emit('message', 'Hello world!');
  }
}
