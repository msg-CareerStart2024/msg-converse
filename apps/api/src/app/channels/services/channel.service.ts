import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Channel } from '../domain/channel.entity';
import { ChannelRepository } from '../repository/channel.repository';
import { TopicService } from './topic.service';

@Injectable()
export class ChannelService {
    constructor(
        private readonly channelRepository: ChannelRepository,
        private readonly topicService: TopicService,
        @InjectEntityManager() private readonly entityManager: EntityManager
    ) {}

    async searchChannels(searchTerm: string): Promise<Channel[]> {
        return this.channelRepository.searchChannels(searchTerm);
    }

    async getById(channelId: string): Promise<Channel> {
        return await this.channelRepository.findOneById(channelId);
    }

    async create(newChannelData: Omit<Channel, 'id' | 'createdAt'>): Promise<Channel> {
        return this.entityManager.transaction(async transactionalEntityManager => {
            const topicNames = newChannelData.topics.map(topic => topic.name);
            const topics = await this.topicService.getOrCreateTopics(
                topicNames,
                transactionalEntityManager
            );
            const newChannel = this.createChannelEntity(newChannelData);
            newChannel.topics = topics;

            return await this.channelRepository.save(newChannel, transactionalEntityManager);
        });
    }

    async update(channelId: string, updateChannelData: Partial<Channel>): Promise<Channel> {
        return this.entityManager.transaction(async transactionalEntityManager => {
            const existingChannel = await this.channelRepository.findOneById(channelId);

            if (updateChannelData.name) {
                existingChannel.name = updateChannelData.name;
            }

            if (updateChannelData.description) {
                existingChannel.description = updateChannelData.description;
            }

            if (updateChannelData.topics) {
                const topicNames = updateChannelData.topics.map(topic => topic.name);
                const topics = await this.topicService.getOrCreateTopics(
                    topicNames,
                    transactionalEntityManager
                );
                existingChannel.topics = topics;
            }

            return await this.channelRepository.save(existingChannel, transactionalEntityManager);
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
