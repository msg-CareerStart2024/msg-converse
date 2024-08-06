import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Topic } from '../domain/topic.entity';

@Injectable()
export class TopicRepository {
    constructor(
        @InjectRepository(Topic)
        private readonly repository: Repository<Topic>
    ) {}

    async findOneById(id: string): Promise<Topic> {
        return await this.repository.findOneBy({ id });
    }

    async findAll(): Promise<Topic[]> {
        return this.repository.find();
    }

    async findByName(name: string): Promise<Topic> {
        return await this.repository.findOneBy({ name });
    }

    async save(topic: Topic, manager?: EntityManager): Promise<Topic> {
        if (manager) {
            return await manager.save(topic);
        } else {
            return await this.repository.save(topic);
        }
    }
}
