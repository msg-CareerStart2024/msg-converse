import { CreateTopicDto } from '../dto/topics/create-topic.dto';
import { Topic } from '../domain/topic.entity';
import { TopicDto } from '../dto/topics/topic.dto';

export class TopicMapper {
    static toDto(entity: Topic): TopicDto {
        return { id: entity.id, name: entity.name };
    }

    static fromCreateDto(dto: CreateTopicDto): Topic {
        return { name: dto.name, id: undefined, channels: undefined };
    }
}
