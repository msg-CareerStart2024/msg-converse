import { CreateTopicDto } from '../dto/topics/create-topic.dto';
import { Topic } from '../domain/topic.entity';
import { TopicDto } from '../dto/topics/topic.dto';

export const mockTopic: Topic = {
  id: '1',
  name: 'Test Topic',
  channels: []
};

export const mockTopics: Topic[] = [
  { id: '1', name: 'Topic 1', channels: [] },
  { id: '2', name: 'Topic 2', channels: [] }
];

export const mockTopicDto: TopicDto = {
  id: '1',
  name: 'Test Topic'
};

export const mockCreateTopicDto: CreateTopicDto = {
  name: 'NEW TOPIC'
};
