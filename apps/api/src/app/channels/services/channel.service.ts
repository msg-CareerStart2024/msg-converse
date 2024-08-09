import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Channel } from '../domain/channel.entity';
import { ChannelRepository } from '../repository/channel.repository';
import { TopicService } from './topic.service';
import { UserService } from '../../users/service/user.service';

@Injectable()
export class ChannelService {
    constructor(
        private readonly channelRepository: ChannelRepository,
        private readonly topicService: TopicService,
        private readonly userService: UserService,
        @InjectEntityManager() private readonly entityManager: EntityManager
    ) {}

    async getAll(): Promise<Channel[]> {
        return await this.channelRepository.getAll();
    }

    async getById(channelId: string): Promise<Channel> {
        return await this.channelRepository.getById(channelId);
    }

    async create(
        userId: string,
        newChannelData: Omit<Channel, 'id' | 'createdAt'>
    ): Promise<Channel> {
        return this.entityManager.transaction(async transactionalEntityManager => {
            const topicNames = newChannelData.topics.map(topic => topic.name);
            const topics = await this.topicService.getOrCreateTopics(
                topicNames,
                transactionalEntityManager
            );
            const users = [await this.userService.getById(userId)];
            const newChannel = this.createChannelEntity(newChannelData);
            newChannel.topics = topics;
            newChannel.users = users;

            return await this.channelRepository.create(newChannel, transactionalEntityManager);
        });
    }

    async update(channelId: string, updateChannelData: Partial<Channel>): Promise<Channel> {
        return this.entityManager.transaction(async transactionalEntityManager => {
            const existingChannel = await this.channelRepository.getById(channelId);

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

            return await this.channelRepository.create(existingChannel, transactionalEntityManager);
        });
    }

    async remove(channelId: string, manager?: EntityManager): Promise<void> {
        await this.channelRepository.remove(channelId, manager);
    }

    private createChannelEntity(newChannelData: Omit<Channel, 'id' | 'createdAt'>): Channel {
        const newChannel = new Channel();
        newChannel.name = newChannelData.name;
        newChannel.description = newChannelData.description;
        return newChannel;
    }
}
