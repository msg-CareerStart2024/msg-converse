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
    topics,
    users: [],
    messages: []
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
    topics,
    users: [],
    messages: []
});

export const mockNewChannelData: Omit<Channel, 'id' | 'createdAt'> = {
    name: 'New Channel',
    description: 'New Description',
    topics: [{ id: undefined, name: 'NEW_TOPIC', channels: [] }],
    users: [],
    messages: []
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
    topics: [{ id: undefined, name: 'NEW_TOPIC_2', channels: [] }]
};

export const mockChannels: Channel[] = [
    mockChannelFactory(
        '1',
        'msg Career Start 2024',
        'Channel for the 7th edition of Career Start',
        new Date('2024-08-01'),
        [{ id: '1', name: 'CAREER_START', channels: [] }]
    ),
    mockChannelFactory(
        '2',
        'msg Converse',
        'Channel for the msg Converse project',
        new Date('2024-08-02'),
        [{ id: '2', name: 'PROJECT', channels: [] }]
    ),
    mockChannelFactory(
        '3',
        'msg Insurance',
        'Channel for Insurance department',
        new Date('2024-08-03'),
        [{ id: '3', name: 'TECHNOLOGY', channels: [] }]
    ),
    mockChannelFactory(
        '4',
        'msg 2024 Projects',
        'Overview of all msg projects',
        new Date('2024-08-04'),
        [
            { id: '2', name: 'PROJECT', channels: [] },
            { id: '4', name: '2024', channels: [] }
        ]
    ),
    mockChannelFactory('5', 'msg Soft Skills', 'Soft skills resources', new Date('2024-08-05'), [
        { id: '1', name: 'CAREER_START', channels: [] },
        { id: '5', name: 'DEVELOPMENT', channels: [] },
        { id: '6', name: 'SOFT_SKILLS', channels: [] }
    ])
];
