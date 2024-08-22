export type TypingUser = {
    id: string;
    firstName: string;
};

export type NewMessagePayload = {
    channelId: string;
    content: string;
};

export type UpdatePinStatusPayload = {
    channelId: string;
    messageId: string;
    pinStatus: boolean;
};

export type UpdateDeletedStatusPayload = {
    channelId: string;
    messageId: string;
    deletedStatus: boolean;
};
