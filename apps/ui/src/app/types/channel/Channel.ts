import { Topic } from './Topic';

export interface Channel {
    id: string;
    name: string;
    topics: Topic[];
    description: string;
    createdAt: Date;
}
