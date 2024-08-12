import { Topic } from './Topic';

export interface Channel {
    id: string;
    name: string;
    topics: Topic[];
    description: string;
    createdAt: Date;
}

export interface ChannelDTO {
    name: string;
    topics: string[];
    description: string;
}
