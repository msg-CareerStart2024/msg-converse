import { Channel } from '../domain/channel.entity';
import { ChannelDto } from '../dto/channels/channel.dto';
import { TopicMapper } from './topic.mapper';

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
}
