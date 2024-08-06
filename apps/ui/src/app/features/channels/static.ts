import { Channel } from '../../types/channels/Channel';
import { Topic } from '../../types/channels/Topic';

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
