import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Topic } from '../domain/topic.entity';
import { TopicRepository } from '../repository/topic.repository';

@Injectable()
export class TopicService {
    constructor(private topicRepository: TopicRepository) {}

    async getAll(): Promise<Topic[]> {
        return await this.topicRepository.getAll();
    }

    async getById(id: string): Promise<Topic> {
        return await this.topicRepository.getById(id);
    }

    async delete(id: string, manager?: EntityManager): Promise<void> {
        await this.topicRepository.deleteById(id, manager);
    }
}
