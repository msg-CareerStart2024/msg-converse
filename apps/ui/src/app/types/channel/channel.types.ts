export type FormValues = {
    channelName: string;
    description?: string;
    topics: string[];
};

export enum ACTION_TYPE {
    create,
    update,
    delete
}
