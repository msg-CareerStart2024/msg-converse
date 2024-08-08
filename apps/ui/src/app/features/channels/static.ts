import { Channel } from '../../types/channel/Channel';
import { Topic } from '../../types/channel/Topic';

const topics: Topic[] = [
    {
        id: '1',
        name: 'Topic 1'
    },
    {
        id: '2',
        name: 'Topic 2'
    },
    {
        id: '3',
        name: 'Topic 3'
    }
];

export const CHANNEL: Channel = {
    id: '1',
    name: 'First channel',
    topics: topics,
    description: 'This is the first channel',
    createdAt: new Date()
};

export const USER = 'John';
