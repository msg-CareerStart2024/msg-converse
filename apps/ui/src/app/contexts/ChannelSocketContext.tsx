import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

import { ChannelSocketContextType } from '../types/socket/ChannelSocketContextType.interface';
import { RootState } from '../store/store';
import { SocketEvent } from '../types/socket/SocketEvent.enum';
import { WS_BASE_URL } from '../config/api-config';
import { registerSocketInstance } from '../api/socket-api/socket-api';
import { useSelector } from 'react-redux';

const ChannelSocketContext = createContext<ChannelSocketContextType>({
    activeSocket: null,
    initializeChannelConnection: () => console.warn('ChannelSocketProvider not set up'),
    terminateChannelConnection: () => console.warn('ChannelSocketProvider not set up')
});

export const useChatSocket = () => useContext(ChannelSocketContext);

type ChannelSocketProviderProps = React.PropsWithChildren<Record<never, never>>;

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
                console.log('Socket connected successfully');
                setActiveSocket(newChannelSocket);
                registerSocketInstance(() => newChannelSocket);
            };

            const handleConnectionError = (error: Error) => {
                console.error('Socket connection error:', error);
            };

            const handleDisconnect = (reason: string) => {
                console.log('Socket disconnected:', reason);
            };

            newChannelSocket.on(SocketEvent.CONNECT, handleConnect);
            newChannelSocket.on(SocketEvent.CONNECTION_ERROR, handleConnectionError);
            newChannelSocket.on(SocketEvent.DISCONNECT, handleDisconnect);

            socketRef.current = newChannelSocket;

            return () => {
                newChannelSocket.off(SocketEvent.CONNECT, handleConnect);
                newChannelSocket.off(SocketEvent.CONNECTION_ERROR, handleConnectionError);
                newChannelSocket.off(SocketEvent.DISCONNECT, handleDisconnect);
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
