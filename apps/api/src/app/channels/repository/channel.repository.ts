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

    async findOneById(id: string): Promise<Channel> {
        return this.repository.findOne({
            where: { id },
            relations: ['topics']
        });
    }

    async searchChannels(searchKey: string): Promise<Channel[]> {
        const searchPattern = `%${searchKey.toLowerCase()}%`;

        return this.repository
            .createQueryBuilder('channel')
            .leftJoinAndSelect('channel.topics', 'topic')
            .where(qb => {
                const subQuery = qb
                    .subQuery()
                    .select('c.id')
                    .from(Channel, 'c')
                    .leftJoin('c.topics', 't')
                    .where('LOWER(c.name) LIKE :searchPattern', { searchPattern })
                    .orWhere('LOWER(t.name) LIKE :searchPattern', { searchPattern })
                    .orWhere('LOWER(LEFT(c.description, 50)) LIKE :searchPattern', {
                        searchPattern
                    })
                    .getQuery();
                return 'channel.id IN ' + subQuery;
            })
            .orderBy('channel.createdAt', 'DESC')
            .getMany();
    }

    async findAll(): Promise<Channel[]> {
        return this.repository.find({ relations: ['topics'] });
    }

    async findByName(name: string): Promise<Channel> {
        return this.repository.findOne({
            where: { name },
            relations: ['topics', 'users']
        });
    }

    async save(channel: Channel, manager?: EntityManager): Promise<Channel> {
        if (manager) {
            return manager.save(channel);
        } else {
            return this.repository.save(channel);
        }
    }

    async deleteById(id: string, manager?: EntityManager): Promise<void> {
        if (manager) {
            await manager.delete(Channel, id);
        }
        await this.repository.delete(id);
    }
}
