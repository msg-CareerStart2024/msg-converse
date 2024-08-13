import { Topic } from './Topic.types';

export interface Channel {
    id: string;
    name: string;
    topics: Topic[];
    description: string;
    createdAt: Date;
}

export interface ChannelDTO {
    name: string;
    topics: { name: string }[];
    description: string;
}
