import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Topic } from '../domain/topic.entity';
import { TopicRepository } from '../repository/topic.repository';

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
        const topics: Topic[] = [];

        for (const topicName of uniqueTopicNames) {
            let topic = await this.topicRepository.findByName(topicName);

            if (!topic) {
                topic = new Topic();
                topic.name = topicName.trim();
                topic = await this.topicRepository.save(topic, manager);
            }

            topics.push(topic);
        }

        return topics;
    }

    async getByName(name: string): Promise<Topic> {
        return await this.topicRepository.findByName(name);
    }

    async getById(id: string): Promise<Topic> {
        return await this.topicRepository.getById(id);
    }

    async delete(id: string, manager?: EntityManager): Promise<void> {
        await this.topicRepository.deleteById(id, manager);
    }
}
