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

    async getOneById(id: string): Promise<Channel | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['topics', 'users', 'messages']
        });
    }

    async getAll(): Promise<Channel[]> {
        return this.repository.find();
    }

    async getByName(name: string): Promise<Channel | null> {
        return this.repository.findOne({
            where: { name },
            relations: ['topics', 'users']
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

    async save(channel: Channel, manager?: EntityManager): Promise<Channel> {
        const repo = this.getRepo(manager);
        return repo.save(channel);
    }

    async remove(id: string, manager?: EntityManager): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.delete(id);
    }

    private getRepo(manager?: EntityManager): Repository<Channel> {
        return manager?.getRepository(Channel) ?? this.repository;
    }
}
