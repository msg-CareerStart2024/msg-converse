import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ChannelService } from '../../channels/services/channels/channel.service';
import { Message } from '../domain/message.domain';
import { MessageRepository } from '../repository/message.repository';
import { UserService } from '../../users/service/user.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class MessageService {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly userService: UserService,
        @Inject(forwardRef(() => ChannelService))
        private readonly channelService: ChannelService
    ) {}

    async getByChannel(channelId: string): Promise<Message[]> {
        const messages: Message[] = await this.messageRepository.getByChannel(channelId);
        return messages.map(message =>
            message.isDeleted ? { ...message, content: undefined } : message
        );
    }

    async create(userId: string, channelId: string, messageData: Message): Promise<Message> {
        const user = await this.userService.getById(userId);
        const channel = await this.channelService.getById(channelId);

        if (!user) {
            throw new NotFoundException('The user was not found');
        }

        if (!channel) {
            throw new NotFoundException('The channel was not found');
        }

        const newMessage: Message = new Message();
        newMessage.content = messageData.content;
        newMessage.isPinned = false;
        newMessage.isDeleted = false;
        newMessage.user = user;
        newMessage.channel = channel;

        return this.messageRepository.create(newMessage);
    }

    async update(id: string, messageData: Message): Promise<Message> {
        const existingMessage = await this.messageRepository.getById(id);

        if (!existingMessage) {
            throw new NotFoundException('The message was not found');
        }

        existingMessage.isPinned = messageData.isPinned;
        existingMessage.isDeleted = messageData.isDeleted;

        return this.messageRepository.update(existingMessage);
    }

    async updateDeletedStatus(id: string, newDeletedStatus: boolean): Promise<Message> {
        const existingMessage = await this.messageRepository.getById(id);

        if (!existingMessage) {
            throw new NotFoundException('The message was not found');
        }

        existingMessage.isDeleted = newDeletedStatus;
        existingMessage.isPinned = false;

        return this.messageRepository.update(existingMessage);
    }

    async removeByChannelId(channelId: string, manager?: EntityManager): Promise<void> {
        await this.messageRepository.removeByChannelId(channelId, manager);
    }

    async remove(id: string): Promise<void> {
        this.messageRepository.remove(id);
    }
}
