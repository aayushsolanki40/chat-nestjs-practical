import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OpenAI } from 'openai';
import { createClient } from '@redis/client';
import { createAdapter } from '@socket.io/redis-adapter';

@WebSocketGateway({
  cors: { origin: ['http://localhost:3000'], credentials: true },
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private openai: OpenAI;

  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const pubClient = createClient({ url: 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();

    Promise.all([pubClient.connect(), subClient.connect()])
      .then(() => {
        this.server.adapter(createAdapter(pubClient, subClient));
        console.log('Redis adapter connected');
      })
      .catch((error) => {
        console.error('Redis connection failed:', error);
      });
  }

  private connectedUsers: Record<string, string> = {};

  async handleConnection(client: Socket): Promise<void> {
    try {
      const user = await this.getAuthUserId(client);

      this.connectedUsers[client.id] = user.id;
      console.log(`Client connected: ${client.id}, User Id: ${user.id}`);
    } catch (error) {
      console.error('Error parsing cookies:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const username = this.connectedUsers[client.id];
    console.log(username);
    delete this.connectedUsers[client.id];
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { room: string; username: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { room } = data;
    client.join(room);
    this.server.to(room).emit('user-joined', `a user has joined the room.`);
  }

  // Leave a specific room
  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.leave(roomId);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user = await this.getAuthUserId(client);

    const { room, message } = data;

    // Broadcast the message to the specified room
    this.server.to(room).emit('new-message', {
      message,
      userId: user.id,
      roomId: room,
      username: user.username,
    });
    console.log(`Message from in room ${room}: ${message}`);
  }

  async getAuthUserId(@ConnectedSocket() client: Socket) {
    const cookies = cookie.parse(client.handshake.headers.cookie || '');
    const jwt = cookies.jwt;

    if (!jwt) {
      client.disconnect();
      console.error('Authorization failed.');
      return;
    }

    const decoded = this.jwtService.verify(jwt);
    const userId = decoded.sub;

    const user = await this.userService.findOne(userId);
    if (!user) {
      console.error('User not found. Disconnecting client.');
      client.disconnect();
      return;
    }

    return user;
  }
}
