import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../domain/message.domain';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class MessageRepository {
    constructor(
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>
    ) {}

    async getByChannel(channelId: string): Promise<Message[]> {
        return this.messageRepository.find({ where: { channel: { id: channelId } } });
    }

    async getById(id: string): Promise<Message> {
        return this.messageRepository.findOneBy({ id });
    }

    async create(messageData: Message): Promise<Message> {
        return this.messageRepository.save(messageData);
    }

    async update(messageData: Message): Promise<Message> {
        return this.messageRepository.save(messageData);
    }

    async removeByChannelId(channelId: string, manager?: EntityManager): Promise<void> {
        const repo = manager ? manager.getRepository(Message) : this.messageRepository;
        await repo.delete({ channel: { id: channelId } });
    }

    async remove(id: string): Promise<void> {
        this.messageRepository.delete(id);
    }
}
