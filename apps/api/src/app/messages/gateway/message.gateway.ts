import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../enum/socket-event.enum';
import { UserService } from '../../users/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/domain/user.domain';
import { MessageService } from '../service/message.service';
import { Message } from '../domain/message.domain';

declare module 'socket.io' {
    interface Socket {
        user?: User;
    }
}

@WebSocketGateway()
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    private logger: Logger = new Logger('MessagesGateway');

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private messageService: MessageService
    ) {}

    afterInit(): void {
        this.logger.log('Server initialized');
    }

    async handleConnection(client: Socket): Promise<void> {
        const token = client.handshake.auth.accessToken;

        if (!token) {
            this.logger.error('No authorization token provided!');
            client.emit(SocketEvent.CONNECTION_ERROR, 'No auth token');
            client.disconnect();
            return;
        }

        try {
            const data = await this.jwtService.verifyAsync(token);
            client.user = await this.userService.getById(data.sub);
            this.logger.log(`Client connected: ${client.id}`);
        } catch (error) {
            this.logger.error(
                'The authorization token provided is not valid or has expired!',
                error
            );
            client.emit(SocketEvent.CONNECTION_ERROR, 'Invalid token');
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage(SocketEvent.JOIN_CHANNEL_CHAT)
    async handleConnectToChannel(client: Socket, channel: string): Promise<void> {
        client.join(channel);
        const messages: Message[] = await this.messageService.getByChannel(channel);
        client.emit(SocketEvent.PREVIOUS_MESSAGES, messages);
    }

    @SubscribeMessage(SocketEvent.LEAVE_CHANNEL_CHAT)
    handleDisconnectFromChannel(client: Socket, channel: string): void {
        client.leave(channel);
    }

    @SubscribeMessage(SocketEvent.SEND_MESSAGE)
    async handleNewMessage(
        client: Socket,
        { channelId, content }: { channelId: string; content: string }
    ): Promise<void> {
        const newMessage = await this.messageService.create(client.user.id, channelId, {
            content
        } as Message);
        this.server.to(channelId).emit(SocketEvent.NEW_MESSAGE, newMessage);
    }
}
