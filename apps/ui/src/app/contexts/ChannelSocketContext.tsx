import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

import { useSelector } from 'react-redux';
import { registerSocketInstance } from '../api/socket-api/socket-api';
import { WS_BASE_URL } from '../config/api-config';
import { RootState } from '../store/store';
import { ChannelSocketContextType } from '../types/socket/ChannelSocketContextType.interface';
import { SocketEvent } from '../types/socket/SocketEvent.enum';

const ChannelSocketContext = createContext<ChannelSocketContextType>({
    activeSocket: null,
    initializeChannelConnection: () => console.warn('ChannelSocketProvider not set up'),
    terminateChannelConnection: () => console.warn('ChannelSocketProvider not set up')
});

export const useChatSocket = () => useContext(ChannelSocketContext);

type ChannelSocketProviderProps = {
    children: React.ReactNode;
};

export const ChannelSocketProvider: React.FC<ChannelSocketProviderProps> = ({ children }) => {
    const [activeSocket, setActiveSocket] = useState<Socket | null>(null);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const socketRef = useRef<Socket | null>(null);

    const initializeChannelConnection = useCallback(
        (channelId: string) => {
            if (!accessToken || socketRef.current) return;

            const newChannelSocket = io(WS_BASE_URL, {
                auth: { accessToken },
                query: { channelId },
                transports: ['websocket'],
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            const handleConnect = () => {
                setActiveSocket(newChannelSocket);
                registerSocketInstance(() => newChannelSocket);
            };

            const handleConnectionError = (error: Error) => {
                console.error('Socket connection error:', error);
            };

            newChannelSocket.on(SocketEvent.CONNECT, handleConnect);
            newChannelSocket.on(SocketEvent.CONNECTION_ERROR, handleConnectionError);

            socketRef.current = newChannelSocket;

            return () => {
                newChannelSocket.off(SocketEvent.CONNECT, handleConnect);
                newChannelSocket.off(SocketEvent.CONNECTION_ERROR, handleConnectionError);
            };
        },
        [accessToken]
    );

    const terminateChannelConnection = useCallback(() => {
        if (!socketRef.current) return;

        socketRef.current.disconnect();
        socketRef.current = null;
        setActiveSocket(null);
        registerSocketInstance(() => null);
    }, []);

    useEffect(() => terminateChannelConnection, [terminateChannelConnection]);

    const contextValue = {
        activeSocket,
        initializeChannelConnection,
        terminateChannelConnection
    };

    return (
        <ChannelSocketContext.Provider value={contextValue}>
            {children}
        </ChannelSocketContext.Provider>
    );
};
