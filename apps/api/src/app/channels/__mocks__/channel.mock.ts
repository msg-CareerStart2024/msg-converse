// channel.mock.ts

import { Channel } from '../domain/channel.entity';
import { ChannelDto } from '../dto/channels/channel.dto';
import { CreateChannelDto } from '../dto/channels/create-channel.dto';
import { CreateTopicDto } from '../dto/topics/create-topic.dto';
import { Topic } from '../domain/topic.entity';
import { UpdateChannelDto } from '../dto/channels/update-channel.dto';
import { mockTopics } from './topic.mock';

export const mockChannelFactory = (
    id = '1',
    name = 'Channel 1',
    description = 'Description 1',
    createdAt = new Date('2024-08-09T00:00:00Z'),
    topics = [] as Topic[]
): Channel => ({
    id,
    name,
    description,
    createdAt,
    topics
});

export const mockChannelDtoFactory = (
    id = '1',
    name = 'Channel 1',
    description = 'Description 1',
    createdAt = new Date('2024-08-09T00:00:00Z'),
    topics = [] as Topic[]
): ChannelDto => ({
    id,
    name,
    description,
    createdAt,
    topics
});

export const mockChannels: Channel[] = [
    mockChannelFactory(),
    mockChannelFactory('2', 'Channel 2', 'Description 2', new Date('2024-08-09T00:00:00Z'))
];

export const mockNewChannelData: Omit<Channel, 'id' | 'createdAt'> = {
    name: 'New Channel',
    description: 'New Description',
    topics: [{ id: undefined, name: 'NEW_TOPIC', channels: [] }]
};

export const mockChannelDto: ChannelDto = mockChannelDtoFactory();

export const mockCreateChannelDto: CreateChannelDto = {
    name: 'New Channel',
    description: 'New Description',
    topics: [{ name: 'NEW_TOPIC_1' }] as CreateTopicDto[]
};

export const mockUpdateChannelDto: UpdateChannelDto = {
    name: 'Updated Channel',
    description: 'Updated Description'
};

export const mockChannelWithTopics: Channel = mockChannelFactory(
    '1',
    'Channel 1',
    'Description 1',
    new Date('2024-08-09T00:00:00Z'),
    mockTopics
);

export const mockChannelDtoWithTopics: ChannelDto = mockChannelDtoFactory(
    '1',
    'Channel 1',
    'Description 1',
    new Date('2024-08-09T00:00:00Z'),
    mockTopics.map(topic => ({ id: topic.id, name: topic.name, channels: undefined }))
);

export const mockUpdateChannelData: Partial<Channel> = {
    name: 'Updated Channel',
    description: 'Updated Description',
    topics: [{ id: undefined, name: 'NEW_TOPIC_2', channels: [] }] as Topic[]
};
