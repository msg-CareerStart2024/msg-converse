import { CreateTopicDto } from '../dto/topics/create-topic.dto';
import { Topic } from '../domain/topic.entity';
import { TopicDto } from '../dto/topics/topic.dto';

export const mockTopic: Topic = {
    id: '1',
    name: 'TEST_TOPIC',
    channels: []
};

export const mockTopics: Topic[] = [
    { id: '1', name: 'TOPIC_1', channels: [] },
    { id: '2', name: 'TOPIC_2', channels: [] }
];

export const mockTopicDto: TopicDto = {
    id: '1',
    name: 'TEST_TOPIC'
};

export const mockCreateTopicDto: CreateTopicDto = {
    name: 'NEW_TOPIC'
};
