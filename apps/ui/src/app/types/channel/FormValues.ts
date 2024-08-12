import { Topic } from './Topic';

export interface FormValues {
    channelName: string;
    description?: string;
    topics: Topic[];
}
