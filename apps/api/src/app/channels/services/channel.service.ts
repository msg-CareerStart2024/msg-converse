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
        if (!searchTerm || searchTerm.trim() === '') {
            return this.channelRepository.findAll();
        }
        return this.channelRepository.searchChannels(searchTerm.trim());
    }

    async getById(channelId: string): Promise<Channel> {
        return await this.channelRepository.findOneById(channelId);
    }

    async create(newChannelData: Omit<Channel, 'id' | 'createdAt'>): Promise<Channel> {
        return this.transactionManager.runInTransaction(async manager => {
            const topicNames = newChannelData.topics.map(topic => topic.name);
            const topics = await this.topicService.getOrCreateTopics(topicNames, manager);
            const newChannel = this.createChannelEntity(newChannelData);
            newChannel.topics = topics;

            return await this.channelRepository.save(newChannel, manager);
        });
    }

    async update(channelId: string, updateChannelData: Partial<Channel>): Promise<Channel> {
        return await this.transactionManager.runInTransaction(async manager => {
            const existingChannel = await this.channelRepository.findOneById(channelId);

            if (updateChannelData.name) {
                existingChannel.name = updateChannelData.name;
            }

            if (updateChannelData.description) {
                existingChannel.description = updateChannelData.description;
            }

            if (updateChannelData.topics) {
                const topicNames = updateChannelData.topics.map(topic => topic.name);
                const topics = await this.topicService.getOrCreateTopics(topicNames, manager);
                existingChannel.topics = topics;
            }

            return await this.channelRepository.save(existingChannel, manager);
        });
    }

    async delete(channelId: string, manager?: EntityManager): Promise<void> {
        await this.channelRepository.deleteById(channelId, manager);
    }

    private createChannelEntity(newChannelData: Omit<Channel, 'id' | 'createdAt'>): Channel {
        const newChannel = new Channel();
        newChannel.name = newChannelData.name;
        newChannel.description = newChannelData.description;
        return newChannel;
    }
}
