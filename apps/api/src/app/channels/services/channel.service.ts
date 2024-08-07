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

    async getAll(): Promise<Channel[]> {
        return await this.channelRepository.findAll();
    }

    async getById(id: string): Promise<Channel> {
        return await this.channelRepository.findOneById(id);
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

    private createChannelEntity(createChannelDto: Omit<Channel, 'id' | 'createdAt'>): Channel {
        const newChannel = new Channel();
        newChannel.name = createChannelDto.name;
        newChannel.description = createChannelDto.description;
        return newChannel;
    }

    async update(id: string, updateChannelData: Partial<Channel>): Promise<Channel> {
        return this.entityManager.transaction(async transactionalEntityManager => {
            const existingChannel = await this.channelRepository.findOneById(id);

            if (updateChannelData.name) {
                existingChannel.name = updateChannelData.name;
            }

            if (updateChannelData.description !== undefined) {
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

    async delete(id: string, manager?: EntityManager): Promise<void> {
        await this.channelRepository.deleteById(id, manager);
    }
}
