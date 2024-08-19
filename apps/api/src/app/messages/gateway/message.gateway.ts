import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    private logger: Logger = new Logger('MessagesGateway');

    afterInit() {
        this.logger.log(`Server initialized`);
    }
    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }
}
