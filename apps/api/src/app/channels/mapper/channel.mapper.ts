import { Channel } from '../domain/channel.entity';
import { ChannelDto } from '../dto/channels/channel.dto';
import { CreateChannelDto } from '../dto/channels/create-channel.dto';
import { TopicMapper } from './topic.mapper';
import { UpdateChannelDto } from '../dto/channels/update-channel.dto';
import { MessageMapper } from '../../messages/mapper/message.mapper';
import { UserMapper } from '../../users/mapper/user.mapper';

export class ChannelMapper {
    static toDto(entity: Channel): ChannelDto {
        const { id, name, description, createdAt, users, topics, messages } = entity;
        return {
            id,
            name,
            description,
            createdAt,
            users: users.map(user => UserMapper.toDTO(user)),
            topics: topics.map(topicEntity => TopicMapper.toDto(topicEntity)),
            messages: messages.map(messageEntity => MessageMapper.toDto(messageEntity))
        };
    }

    static fromCreateDto(dto: CreateChannelDto): Omit<Channel, 'id' | 'createdAt'> {
        return {
            name: dto.name,
            description: dto.description,
            topics: dto.topics.map(topicDto => TopicMapper.fromCreateDto(topicDto)),
            messages: undefined,
            users: undefined
        };
    }

    static fromUpdateDto(dto: UpdateChannelDto): Partial<Channel> {
        return {
            name: dto.name,
            description: dto.description,
            topics: dto.topics
                ? dto.topics.map(topicDto => TopicMapper.fromCreateDto(topicDto))
                : undefined
        };
    }
}
