import { Message } from '../messages/Message.types';

export interface ChannelMessagesState {
    [channelId: string]: Message[];
}
