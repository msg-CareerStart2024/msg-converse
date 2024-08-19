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
        private jwtService: JwtService
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
    handleConnectToChannel(client: Socket, channel: string): void {
        client.join(channel);
    }

    @SubscribeMessage(SocketEvent.LEAVE_CHANNEL_CHAT)
    handleDisconnectFromChannel(client: Socket, channel: string): void {
        client.leave(channel);
    }

    @SubscribeMessage(SocketEvent.NEW_MESSAGE)
    handleNewMessage(): void {
        this.logger.log('new message');
    }

    @SubscribeMessage(SocketEvent.PREVIOUS_MESSAGES)
    handlePreviousMessages(): void {
        this.logger.log('previous messages');
    }
}
