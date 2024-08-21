export type TypingUser = {
    id: string;
    firstName: string;
};

export type NewMessagePayload = {
    channelId: string;
    content: string;
};

export type UpdateDeletedStatusPayload = {
    channelId: string;
    messageId: string;
    deletedStatus: boolean;
};
