import { Channel } from '../domain/channel.entity';
import { ChannelDto } from '../dto/channels/channel.dto';
import { CreateChannelDto } from '../dto/channels/create-channel.dto';
import { Topic } from '../domain/topic.entity';
import { TopicMapper } from './topic.mapper';
import { UpdateChannelDto } from '../dto/channels/update-channel.dto';

export class ChannelMapper {
    static toDto(entity: Channel): ChannelDto {
        const { id, name, description, createdAt, topics } = entity;
        return {
            id,
            name,
            description,
            createdAt,
            topics: topics.map(topicEntity => TopicMapper.toDto(topicEntity))
        };
    }

    static fromCreateDto(dto: CreateChannelDto): Omit<Channel, 'id' | 'createdAt'> {
        const { name, description, topics } = dto;
        return {
            name,
            description,
            topics: topics.map(topicDto => {
                const topic = new Topic();
                Object.assign(topic, TopicMapper.fromCreateDto(topicDto));
                return topic;
            })
        };
    }

    static fromUpdateDto(dto: UpdateChannelDto): Partial<Omit<Channel, 'id' | 'createdAt'>> {
        const { name, description, topics } = dto;

        return {
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description }),
            ...(topics && {
                topics: topics.map(topicDto => {
                    const topic = new Topic();
                    Object.assign(topic, TopicMapper.fromCreateDto(topicDto));
                    return topic;
                })
            })
        };
    }
}
