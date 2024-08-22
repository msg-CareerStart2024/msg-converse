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
import {
    NewMessagePayload,
    TypingUser,
    UpdateDeletedStatusPayload,
    UpdatePinStatusPayload
} from '../type/message-gateway.types';
import { Role } from '../../users/enums/role.enum';

declare module 'socket.io' {
    interface Socket {
        user?: User;
    }
}

type TypingUsersMap = Map<string, Map<string, TypingUser>>;

@WebSocketGateway()
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    private logger: Logger = new Logger('MessagesGateway');
    private typingUsers: TypingUsersMap = new Map();

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
        this.typingUsers.forEach((users, channelId) => {
            if (users.has(client.user.id)) {
                this.removeTypingUser(channelId, client.user);
                this.emitTypingUsers(channelId);
            }
        });
    }

    @SubscribeMessage(SocketEvent.JOIN_CHANNEL_CHAT)
    async handleConnectToChannel(client: Socket, channel: string): Promise<void> {
        client.join(channel);
    }

    @SubscribeMessage(SocketEvent.LEAVE_CHANNEL_CHAT)
    handleDisconnectFromChannel(client: Socket, channel: string): void {
        client.leave(channel);
        this.removeTypingUser(channel, client.user);
        this.emitTypingUsers(channel);
    }

    @SubscribeMessage(SocketEvent.SEND_MESSAGE)
    async handleNewMessage(
        client: Socket,
        { channelId, content }: NewMessagePayload
    ): Promise<void> {
        const newMessage = await this.messageService.create(client.user.id, channelId, {
            content
        } as Message);
        this.server.to(channelId).emit(SocketEvent.NEW_MESSAGE, newMessage);
        this.removeTypingUser(channelId, client.user);
        this.emitTypingUsers(channelId);
    }

    @SubscribeMessage(SocketEvent.UPDATE_DELETED_STATUS_CLIENT)
    async handleUpdateDeletedStatus(
        client: Socket,
        { channelId, messageId, deletedStatus }: UpdateDeletedStatusPayload
    ): Promise<void> {
        if (client.user.role === Role.ADMIN) {
            const updatedMessage = await this.messageService.updateDeletedStatus(
                messageId,
                deletedStatus
            );
            this.server.to(channelId).emit(SocketEvent.UPDATE_DELETED_STATUS, updatedMessage);
        }
    }

    @SubscribeMessage(SocketEvent.START_TYPING)
    handleTyping(client: Socket, channelId: string): void {
        this.addTypingUser(channelId, client.user);
        this.emitTypingUsers(channelId);
    }

    @SubscribeMessage(SocketEvent.STOP_TYPING)
    handleStopTyping(client: Socket, channelId: string): void {
        this.removeTypingUser(channelId, client.user);
        this.emitTypingUsers(channelId);
    }

    private addTypingUser(channelId: string, user: User): void {
        if (!this.typingUsers.has(channelId)) {
            this.typingUsers.set(channelId, new Map());
        }
        this.typingUsers.get(channelId).set(user.id, { id: user.id, firstName: user.firstName });
    }

    private removeTypingUser(channelId: string, user: User): void {
        if (this.typingUsers.has(channelId)) {
            const users = this.typingUsers.get(channelId);
            users.delete(user.id);
            if (users.size === 0) {
                this.typingUsers.delete(channelId);
            }
        }
    }

    private emitTypingUsers(channelId: string): void {
        const typingUsers = Array.from(this.typingUsers.get(channelId)?.values() || []);
        this.server.to(channelId).emit(SocketEvent.TYPING_USERS, typingUsers);
    }

    @SubscribeMessage(SocketEvent.PIN_FROM_CLIENT)
    async handlePinMessage(
        client: Socket,
        { channelId, messageId, pinStatus }: UpdatePinStatusPayload
    ): Promise<void> {
        if (client.user.role === Role.ADMIN) {
            const message = await this.messageService.updatePin(messageId, pinStatus);
            this.server.to(channelId).emit(SocketEvent.PIN_FROM_SERVER, message);
        }
    }
}
