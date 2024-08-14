import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './domain/message.domain';
import { MessageRepository } from './repository/message.repository';
import { MessageService } from './service/message.service';
import { MessageMapper } from './mapper/message.mapper';
import { MessagesController } from './controller/message.controller';
import { ChannelsModule } from '../channels/channels.module';
import { UsersModule } from '../users/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Message]), ChannelsModule, UsersModule],
    providers: [MessageMapper, MessageRepository, MessageService],
    controllers: [MessagesController]
})
export class MessagesModule {}
