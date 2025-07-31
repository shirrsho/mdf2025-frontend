'use client';
import { getAccessToken } from '@/utils';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

type Props = { children: React.ReactNode };

export const SocketProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (socket) {
      return;
    }
    const token = getAccessToken();
    if (!token) {
      return;
    }
    const socketInstance = io(`${process.env.NEXT_PUBLIC_API_URI}`, {
      auth: {
        token,
      },
    });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
