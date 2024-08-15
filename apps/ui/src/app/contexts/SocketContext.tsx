import React, { createContext, useCallback, useContext, useState } from 'react';
import { Socket, io } from 'socket.io-client';

import { BASE_URL } from '../config/api-config';
import { RootState } from '../store/store';
import { injectSocket } from '../api/socket-api/socket-api';
import { useSelector } from 'react-redux';

interface SocketContextType {
    socket: Socket | null;
    connectToChannel: (channelId: string) => void;
    disconnectFromChannel: () => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    connectToChannel: () => {},
    disconnectFromChannel: () => {}
});

export const useSocket = () => useContext(SocketContext);

type SocketProviderProps = React.PropsWithChildren<Record<never, never>>;

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    const connectToChannel = useCallback(
        (channelId: string) => {
            if (accessToken) {
                const newSocket = io(BASE_URL, {
                    auth: { accessToken },
                    query: { channelId },
                    transports: ['websocket']
                });
                setSocket(newSocket);
                injectSocket(() => newSocket);
            }
        },
        [accessToken]
    );

    const disconnectFromChannel = useCallback(() => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
            injectSocket(() => null);
        }
    }, [socket]);

    return (
        <SocketContext.Provider value={{ socket, connectToChannel, disconnectFromChannel }}>
            {children}
        </SocketContext.Provider>
    );
};
