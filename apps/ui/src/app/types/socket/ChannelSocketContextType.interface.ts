import { Socket } from 'socket.io-client';

export interface ChannelSocketContextType {
    activeSocket: Socket | null;
    initializeChannelConnection: (channelId: string) => void;
    terminateChannelConnection: () => void;
}
