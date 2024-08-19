import { Message } from '../../messages/Message.types';

export interface PreviousMessagesPayload {
    channelId: string;
    messages: Message[];
}
