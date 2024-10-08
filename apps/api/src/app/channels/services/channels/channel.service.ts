import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TransactionManager } from '../../../shared/services/transaction.manager';
import { User } from '../../../users/domain/user.domain';
import { UserService } from '../../../users/service/user.service';
import { Channel } from '../../domain/channel.entity';
import { ChannelRepository } from '../../repository/channel.repository';
import { TopicService } from '../topics/topic.service';
import { MessageService } from '../../../messages/service/message.service';

@Injectable()
export class ChannelService {
    constructor(
        private readonly channelRepository: ChannelRepository,
        private readonly topicService: TopicService,
        private readonly userService: UserService,
        @Inject(forwardRef(() => MessageService))
        private readonly messageService: MessageService,
        private readonly transactionManager: TransactionManager
    ) {}

    async searchChannels(searchTerm: string): Promise<Channel[]> {
        const escapedSearchTerm = this.escapeSpecialCharacters(searchTerm?.trim());
        return this.channelRepository.searchChannels(escapedSearchTerm);
    }

    async getById(channelId: string): Promise<Channel> {
        return this.channelRepository.getOneById(channelId);
    }

    async getChannelsJoinedByUser(userId: string): Promise<Channel[]> {
        return this.channelRepository.getChannelsJoinedByUser(userId);
    }

    async create(channelData: Omit<Channel, 'id' | 'createdAt'>, userId: string): Promise<Channel> {
        return this.transactionManager.runInTransaction(async manager => {
            const users = [await this.userService.getById(userId)];
            const topicNames = channelData.topics.map(topic => topic.name);
            const topics = await this.topicService.getOrCreateTopics(topicNames, manager);

            const newChannel = this.createChannelEntity(channelData, topics, users);

            return await this.channelRepository.save(newChannel, manager);
        });
    }

    async update(channelId: string, updateData: Partial<Channel>): Promise<Channel> {
        return this.transactionManager.runInTransaction(async manager => {
            const existingChannel = await this.channelRepository.getOneById(channelId);
            this.updateChannelProperties(existingChannel, updateData);

            if (updateData.topics) {
                existingChannel.topics = await this.getTopics(updateData.topics, manager);
            }

            return this.channelRepository.save(existingChannel, manager);
        });
    }

    async delete(channelId: string): Promise<void> {
        return this.transactionManager.runInTransaction(async manager => {
            await this.messageService.removeByChannelId(channelId, manager);
            await this.channelRepository.remove(channelId, manager);
        });
    }

    async joinChannel(channelId: string, userId: string): Promise<Channel> {
        const channel = await this.channelRepository.getOneById(channelId);
        const user = await this.userService.getById(userId);
        channel.users.push(user);

        return await this.channelRepository.save(channel);
    }

    async leaveChannel(channelId: string, userId: string): Promise<Channel> {
        const channel = await this.channelRepository.getOneById(channelId);
        channel.users = channel.users.filter(user => user.id !== userId);

        return await this.channelRepository.save(channel);
    }

    private escapeSpecialCharacters(term: string): string {
        return term.replace(/[\\%&]/g, '\\$&');
    }

    private createChannelEntity(
        data: Omit<Channel, 'id' | 'createdAt'>,
        desiredTopics: Channel['topics'],
        desiredUsers: User[]
    ): Channel {
        return {
            name: data.name,
            description: data.description,
            topics: desiredTopics,
            users: desiredUsers,
            messages: [],
            id: undefined,
            createdAt: undefined
        };
    }

    private updateChannelProperties(channel: Channel, updateData: Partial<Channel>): void {
        if (updateData.name) {
            channel.name = updateData.name;
        }

        if (updateData.description) {
            channel.description = updateData.description;
        }
    }

    private async getTopics(
        topics: Channel['topics'],
        manager: EntityManager
    ): Promise<Channel['topics']> {
        const topicNames = topics.map(topic => topic.name);
        return this.topicService.getOrCreateTopics(topicNames, manager);
    }
}
