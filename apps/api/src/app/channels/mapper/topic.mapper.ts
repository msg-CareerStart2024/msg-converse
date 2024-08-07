import { CreateTopicDto } from '../dto/topics/create-topic.dto';
import { Topic } from '../domain/topic.entity';
import { TopicDto } from '../dto/topics/topic.dto';

export class TopicMapper {
    static toDto(entity: Topic): TopicDto {
        const { id, name } = entity;
        return { id, name };
    }

    static fromCreateDto(createTopicDto: CreateTopicDto): Omit<Topic, 'id' | 'channels'> {
        const { name } = createTopicDto;
        return { name };
    }
}
