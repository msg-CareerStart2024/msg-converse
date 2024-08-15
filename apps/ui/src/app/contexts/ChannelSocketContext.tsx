import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

import { RootState } from '../store/store';
import { registerSocketInstance } from '../api/socket-api/socket-api';
import { useSelector } from 'react-redux';

interface ChannelSocketContextType {
    activeSocket: Socket | null;
    initializeChannelConnection: (channelId: string) => void;
    terminateChannelConnection: () => void;
}

const defaultInitializeChannelConnection = (channelId: string) => {
    console.warn(
        `Attempted to initialize connection for channel ${channelId}, but ChatSocketProvider is not set up.`
    );
};

const defaultTerminateChannelConnection = () => {
    console.warn(
        'Attempted to terminate channel connection, but ChatSocketProvider is not set up.'
    );
};

const ChannelSocketContext = createContext<ChannelSocketContextType>({
    activeSocket: null,
    initializeChannelConnection: defaultInitializeChannelConnection,
    terminateChannelConnection: defaultTerminateChannelConnection
});

export const useChatSocket = () => useContext(ChannelSocketContext);

type ChannelSocketProviderProps = React.PropsWithChildren<Record<never, never>>;

export const ChannelSocketProvider: React.FC<ChannelSocketProviderProps> = ({ children }) => {
    const [activeSocket, setActiveSocket] = useState<Socket | null>(null);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const socketRef = useRef<Socket | null>(null);

    const initializeChannelConnection = useCallback(
        (channelId: string) => {
            if (accessToken && !socketRef.current) {
                const newChannelSocket = io('http://localhost:3000', {
                    auth: { accessToken },
                    query: { channelId },
                    transports: ['websocket'],
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000
                });

                newChannelSocket.on('connect', () => {
                    console.log('Socket connected successfully');
                    setActiveSocket(newChannelSocket);
                    registerSocketInstance(() => newChannelSocket);
                });

                newChannelSocket.on('connect_error', error => {
                    console.error('Socket connection error:', error);
                });

                newChannelSocket.on('disconnect', reason => {
                    console.log('Socket disconnected:', reason);
                });

                socketRef.current = newChannelSocket;
            }
        },
        [accessToken]
    );

    const terminateChannelConnection = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setActiveSocket(null);
            registerSocketInstance(() => null);
        }
    }, []);

    useEffect(() => {
        return () => {
            terminateChannelConnection();
        };
    }, [terminateChannelConnection]);

    return (
        <ChannelSocketContext.Provider
            value={{
                activeSocket,
                initializeChannelConnection,
                terminateChannelConnection
            }}
        >
            {children}
        </ChannelSocketContext.Provider>
    );
};
