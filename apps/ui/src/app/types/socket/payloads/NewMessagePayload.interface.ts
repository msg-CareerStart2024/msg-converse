import { Message } from '../../messages/Message.types';

export interface NewMessagePayload {
    channelId: string;
    message: Message;
}
