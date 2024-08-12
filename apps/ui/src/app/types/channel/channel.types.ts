import { Topic } from './Topic';

export type FormValues = {
    channelName: string;
    description?: string;
    topics: Topic[];
};

export enum ACTION_TYPE {
    create,
    update,
    delete
}
