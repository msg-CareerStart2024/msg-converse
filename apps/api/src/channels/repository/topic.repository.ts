import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
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

    async findByName(name: string): Promise<Topic> {
        return this.repository.findOneBy({ name });
    }

    async save(topic: Topic, manager?: EntityManager): Promise<Topic> {
        if (manager) {
            return manager.save(Topic, topic);
        }
        return this.repository.save(topic);
    }

    async deleteById(id: string, manager?: EntityManager): Promise<void> {
        if (manager) {
            await manager.delete(Topic, id);
        }
        await this.repository.delete(id);
    }
}
