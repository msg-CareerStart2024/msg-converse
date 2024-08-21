import { Message } from '../messages/Message.types';

export type NewMessagePayload = {
    channelId: string;
    message: Message;
};

export interface PreviousMessagesPayload {
    channelId: string;
    messages: Message[];
}

export type SendMessageEventPayload = {
    channelId: string;
    content: string;
};