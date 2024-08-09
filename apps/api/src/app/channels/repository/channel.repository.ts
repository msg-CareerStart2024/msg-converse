import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Channel } from '../domain/channel.entity';

@Injectable()
export class ChannelRepository {
    constructor(
        @InjectRepository(Channel)
        private readonly repository: Repository<Channel>
    ) {}

    async getById(id: string): Promise<Channel> {
        return this.repository.findOne({
            where: { id },
            relations: ['topics', 'users']
        });
    }

    async getAll(): Promise<Channel[]> {
        return this.repository.find({ relations: ['topics', 'users'] });
    }

    async getByName(name: string): Promise<Channel> {
        return this.repository.findOne({
            where: { name },
            relations: ['topics', 'users']
        });
    }

    async create(channel: Channel, manager?: EntityManager): Promise<Channel> {
        if (manager) {
            return manager.save(channel);
        } else {
            return this.repository.save(channel);
        }
    }

    async remove(id: string, manager?: EntityManager): Promise<void> {
        if (manager) {
            await manager.delete(Channel, id);
        }
        await this.repository.delete(id);
    }
}
