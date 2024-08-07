import { Topic } from '../domain/topic.entity';
import { TopicDto } from '../dto/topics/topic.dto';

export class TopicMapper {
    static toDto(entity: Topic): TopicDto {
        const { id, name } = entity;
        return { id, name };
    }
}
