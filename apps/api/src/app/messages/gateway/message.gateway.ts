import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../../users/domain/user.domain';
import { UserService } from '../../users/service/user.service';
import { Message } from '../domain/message.domain';
import { SocketEvent } from '../enum/socket-event.enum';
import { MessageService } from '../service/message.service';

declare module 'socket.io' {
    interface Socket {
        user?: User;
    }
}

type TypingUser = {
    id: string;
    firstName: string;
};

type TypingUsersMap = Map<string, Set<TypingUser>>;

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
            const userToRemove = Array.from(users).find(user => user.id === client.user.id);
            if (userToRemove) {
                this.removeTypingUser(channelId, userToRemove);
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
        const typingUser: TypingUser = { id: client.user.id, firstName: client.user.firstName };
        this.removeTypingUser(channel, typingUser);
        this.emitTypingUsers(channel);
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
        const typingUser: TypingUser = { id: client.user.id, firstName: client.user.firstName };
        this.removeTypingUser(channelId, typingUser);
        this.emitTypingUsers(channelId);
    }

    @SubscribeMessage(SocketEvent.START_TYPING)
    handleTyping(client: Socket, channelId: string): void {
        const typingUser: TypingUser = { id: client.user.id, firstName: client.user.firstName };
        this.addTypingUser(channelId, typingUser);
        this.emitTypingUsers(channelId);
    }

    @SubscribeMessage(SocketEvent.STOP_TYPING)
    handleStopTyping(client: Socket, channelId: string): void {
        const typingUser: TypingUser = { id: client.user.id, firstName: client.user.firstName };
        this.removeTypingUser(channelId, typingUser);
        this.emitTypingUsers(channelId);
    }

    @SubscribeMessage(SocketEvent.TOGGLE_LIKE_MESSAGE)
    async handleLikeMessage(client: Socket, channelId: string, messageId: string): Promise<void> {
        this.messageService.interact(messageId, client.user.id);
        this.server.to(channelId).emit(SocketEvent.TOGGLE_LIKE_MESSAGE, messageId);
    }

    private addTypingUser(channelId: string, typingUser: TypingUser): void {
        if (!this.typingUsers.has(channelId)) {
            this.typingUsers.set(channelId, new Set());
        }
        this.typingUsers.get(channelId).add(typingUser);
    }

    private removeTypingUser(channelId: string, typingUser: TypingUser): void {
        if (this.typingUsers.has(channelId)) {
            const users = this.typingUsers.get(channelId);
            users.forEach(user => {
                if (user.id === typingUser.id) {
                    users.delete(user);
                }
            });
            if (users.size === 0) {
                this.typingUsers.delete(channelId);
            }
        }
    }

    private emitTypingUsers(channelId: string): void {
        const typingUsers = Array.from(this.typingUsers.get(channelId) || []);
        this.server.to(channelId).emit(SocketEvent.TYPING_USERS, typingUsers);
    }
}
