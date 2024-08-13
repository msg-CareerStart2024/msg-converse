import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Topic } from '../../domain/topic.entity';
import { TopicRepository } from '../../repository/topics/topic.repository';

@Injectable()
export class TopicService {
    constructor(private readonly topicRepository: TopicRepository) {}

    async getAll(): Promise<Topic[]> {
        return await this.topicRepository.getAll();
    }

    async create(topicData: Partial<Topic>, manager?: EntityManager): Promise<Topic> {
        const topic = new Topic();
        topic.name = topicData.name;
        return this.topicRepository.save(topic, manager);
    }

    async getOrCreateTopics(topicNames: string[], manager: EntityManager): Promise<Topic[]> {
        const uniqueTopicNames = [...new Set(topicNames)];
        return this.topicRepository.getOrCreateTopics(uniqueTopicNames, manager);
    }

    async getByName(name: string): Promise<Topic> {
        return await this.topicRepository.getByName(name);
    }

    async getById(id: string): Promise<Topic> {
        return await this.topicRepository.getById(id);
    }

    async remove(id: string, manager?: EntityManager): Promise<void> {
        await this.topicRepository.remove(id, manager);
    }
}
