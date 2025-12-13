'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

// Socket event types
export const SocketEvents = {
  CONNECT_STATUS_UPDATED: 'connect:status_updated',
  ORDER_CREATED: 'order:created',
  ORDER_UPDATED: 'order:updated',
  PAYMENT_RECEIVED: 'payment:received',
} as const;

export type SocketEventType = typeof SocketEvents[keyof typeof SocketEvents];

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  subscribe: <T>(event: SocketEventType, callback: (data: T) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect socket when logged out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';

    const newSocket = io(apiUrl, {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('[Socket] Connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated]);

  const subscribe = useCallback(<T,>(event: SocketEventType, callback: (data: T) => void) => {
    if (!socketRef.current) {
      return () => {};
    }

    socketRef.current.on(event, callback);

    return () => {
      socketRef.current?.off(event, callback);
    };
  }, []);

  const value: SocketContextValue = {
    socket,
    isConnected,
    subscribe,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
