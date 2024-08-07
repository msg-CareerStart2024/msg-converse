import { Channel } from '../domain/channel.entity';
import { ChannelRepository } from '../repository/channel.repository';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelService {
    constructor(private readonly channelRepository: ChannelRepository) {}

    async getAll(): Promise<Channel[]> {
        return await this.channelRepository.findAll();
    }

    async getById(id: string): Promise<Channel> {
        return await this.channelRepository.findOneById(id);
    }
    // async create(newChannel: Partial<Channel>): Promise<Channel> {}

    async delete(id: string, manager?: EntityManager): Promise<void> {
        await this.channelRepository.deleteById(id, manager);
    }
}
