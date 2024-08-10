import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Topic } from '../domain/topic.entity';

@Injectable()
export class TopicRepository {
    constructor(
        @InjectRepository(Topic)
        private readonly repository: Repository<Topic>
    ) {}

    async getById(id: string): Promise<Topic> {
        return this.repository.findOneBy({ id });
    }

    async getAll(): Promise<Topic[]> {
        return this.repository.find();
    }

    async findOrCreateTopics(topicNames: string[], manager?: EntityManager): Promise<Topic[]> {
        const repo = this.getRepo(manager);

        await repo
            .createQueryBuilder()
            .insert()
            .into(Topic)
            .values(topicNames.map(name => ({ name })))
            .orIgnore()
            .execute();

        return repo.find({ where: { name: In(topicNames) } });
    }

    async findByName(name: string): Promise<Topic> {
        return this.repository.findOneBy({ name });
    }

    async save(topic: Topic, manager?: EntityManager): Promise<Topic> {
        const repo = this.getRepo(manager);
        return repo.save(topic);
    }

    async deleteById(id: string, manager?: EntityManager): Promise<void> {
        const repo = this.getRepo(manager);
        await repo.delete(id);
    }

    private getRepo(manager?: EntityManager): Repository<Topic> {
        return manager?.getRepository(Topic) ?? this.repository;
    }
}
