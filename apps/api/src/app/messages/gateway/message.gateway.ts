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

@WebSocketGateway()
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    private logger: Logger = new Logger('MessagesGateway');

    constructor(private userService: UserService) {}

    afterInit(): void {
        this.logger.log('Server initialized');
    }

    handleConnection(client: Socket): void {
        console.log('query:', client.handshake.query);
        console.log('headers:', client.handshake.headers);
        console.log('auth:', client.handshake.auth);
        const accessToken = client.handshake.auth.accessToken;
        if (!accessToken) {
            this.logger.error('No authorization token provided!');
        }

        client.emit(SocketEvent.CONNECTION_ERROR, 'Invalid token');
        client.disconnect();
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage(SocketEvent.JOIN_CHANNEL_CHAT)
    handleConnectToChannel(): void {
        this.logger.log('connect to channel chat');
    }

    @SubscribeMessage(SocketEvent.LEAVE_CHANNEL_CHAT)
    handleDisconnectFromChannel(): void {
        this.logger.log('disconnect from channel chat');
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
