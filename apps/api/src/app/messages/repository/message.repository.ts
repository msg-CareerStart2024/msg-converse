import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../domain/message.domain';
import { Repository } from 'typeorm';

@Injectable()
export class MessageRepository {
    constructor(
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>
    ) {}

    async getByChannel(channelId: string): Promise<Message[]> {
        return this.messageRepository.find({
            where: { channel: { id: channelId } },
            order: { createdAt: 'ASC' }
        });
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

    async remove(id: string): Promise<void> {
        this.messageRepository.delete(id);
    }
}
