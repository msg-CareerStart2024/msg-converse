import { Channel } from '../domain/channel.entity';
import { ChannelDto } from '../dto/channels/channel.dto';
import { CreateChannelDto } from '../dto/channels/create-channel.dto';
import { TopicMapper } from './topic.mapper';
import { UpdateChannelDto } from '../dto/channels/update-channel.dto';

export class ChannelMapper {
    static toDto(entity: Channel): ChannelDto {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            createdAt: entity.createdAt,
            topics: entity.topics.map(topicEntity => TopicMapper.toDto(topicEntity))
        };
    }

    static fromCreateDto(dto: CreateChannelDto): Omit<Channel, 'id' | 'createdAt'> {
        return {
            name: dto.name,
            description: dto.description,
            topics: dto.topics.map(topicDto => TopicMapper.fromCreateDto(topicDto))
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
