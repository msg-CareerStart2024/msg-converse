import { Channel } from '../domain/channel.entity';
import { ChannelRepository } from '../repository/channel.repository';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TransactionManager } from '../../shared/services/transaction.manager';

@Injectable()
export class ChannelService {
    constructor(
        private readonly channelRepository: ChannelRepository,
        private readonly topicService: TopicService,
        private readonly transactionManager: TransactionManager
    ) {}

    async searchChannels(searchTerm: string): Promise<Channel[]> {
        const trimmedSearchTerm = searchTerm?.trim();
        return trimmedSearchTerm
            ? this.channelRepository.searchChannels(trimmedSearchTerm)
            : this.channelRepository.findAll();
    }

    async getById(channelId: string): Promise<Channel> {
        return this.channelRepository.findOneById(channelId);
    }

    async create(channelData: Omit<Channel, 'id' | 'createdAt'>): Promise<Channel> {
        return this.transactionManager.runInTransaction(async manager => {
            const topicNames = channelData.topics.map(topic => topic.name);
            const topics = await this.topicService.getOrCreateTopics(topicNames, manager);

            const newChannel = this.createChannelEntity(channelData, topics);

            return await this.channelRepository.save(newChannel, manager);
        });
    }

    async update(channelId: string, updateData: Partial<Channel>): Promise<Channel> {
        return this.transactionManager.runInTransaction(async manager => {
            const existingChannel = await this.channelRepository.findOneById(channelId);
            this.updateChannelProperties(existingChannel, updateData);

            if (updateData.topics) {
                existingChannel.topics = await this.getTopics(updateData.topics, manager);
            }

            return this.channelRepository.save(existingChannel, manager);
        });
    }

    async delete(channelId: string, manager?: EntityManager): Promise<void> {
        await this.channelRepository.deleteById(channelId, manager);
    }

    private createChannelEntity(
        data: Omit<Channel, 'id' | 'createdAt'>,
        desiredTopics: Channel['topics']
    ): Channel {
        return {
            name: data.name,
            description: data.description,
            topics: desiredTopics,
            id: undefined,
            createdAt: undefined
        };
    }

    private updateChannelProperties(channel: Channel, updateData: Partial<Channel>): void {
        if (updateData.name) channel.name = updateData.name;
        if (updateData.description) channel.description = updateData.description;
    }

    private async getTopics(
        topics: Channel['topics'],
        manager: EntityManager
    ): Promise<Channel['topics']> {
        const topicNames = topics.map(topic => topic.name);
        return this.topicService.getOrCreateTopics(topicNames, manager);
    }
}
