import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Socket, io } from 'socket.io-client';

import { RootState } from '../store/store';
import { injectSocket } from '../api/socket-api/socket-api';
import { useSelector } from 'react-redux';

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

type SocketProviderProps = React.PropsWithChildren<Record<never, never>>;

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);

    const socket = useMemo(() => {
        if (accessToken) {
            return io('http://localhost:3000', {
                auth: { accessToken },
                transports: ['websocket'],
                autoConnect: false
            });
        }
        return null;
    }, [accessToken]);

    useEffect(() => {
        if (socket && accessToken) {
            socket.connect();
            injectSocket(() => socket);
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket, accessToken]);

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
