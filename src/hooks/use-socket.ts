'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ChatMessage, StreamReaction, StreamRequest } from '@/types/streaming';

interface UseSocketOptions {
  autoConnect?: boolean;
  auth?: {
    token: string;
  };
}

interface SocketEvents {
  'stream:started': (streamId: string) => void;
  'stream:ended': (streamId: string) => void;
  'stream:viewers': (data: { streamId: string; count: number }) => void;
  'chat:message': (message: ChatMessage) => void;
  'chat:reaction': (reaction: StreamReaction) => void;
  'chat:request': (request: StreamRequest) => void;
  'user:joined': (userId: string) => void;
  'user:left': (userId: string) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const eventHandlersRef = useRef<Map<string, Set<Function>>>(new Map());

  const { autoConnect = true, auth } = options;

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]);

  const connect = () => {
    if (socketRef.current?.connected) return;

    setIsLoading(true);
    setError(null);

    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
    
    socketRef.current = io(serverUrl, {
      auth: auth || undefined,
      transports: ['websocket', 'polling'],
      upgrade: true,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      setIsLoading(false);
      setError(null);
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      setIsLoading(false);
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      setIsConnected(false);
      setIsLoading(false);
      setError(error.message);
      console.error('Socket connection error:', error);
    });

    socket.on('error', (error) => {
      setError(error.message);
      console.error('Socket error:', error);
    });
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  };

  const emit = <T = any>(event: string, data?: T, callback?: (response: any) => void) => {
    if (socketRef.current && isConnected) {
      if (callback) {
        socketRef.current.emit(event, data, callback);
      } else {
        socketRef.current.emit(event, data);
      }
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  };

  const on = <T = any>(event: keyof SocketEvents, handler: (data: T) => void) => {
    if (!socketRef.current) return;

    // Track event handlers for cleanup
    if (!eventHandlersRef.current.has(event)) {
      eventHandlersRef.current.set(event, new Set());
    }
    eventHandlersRef.current.get(event)?.add(handler);

    socketRef.current.on(event as string, handler);
  };

  const off = <T = any>(event: keyof SocketEvents, handler?: (data: T) => void) => {
    if (!socketRef.current) return;

    if (handler) {
      socketRef.current.off(event as string, handler);
      eventHandlersRef.current.get(event)?.delete(handler);
    } else {
      socketRef.current.off(event as string);
      eventHandlersRef.current.delete(event);
    }
  };

  const joinRoom = (roomId: string, callback?: (response: any) => void) => {
    emit('join:room', { roomId }, callback);
  };

  const leaveRoom = (roomId: string, callback?: (response: any) => void) => {
    emit('leave:room', { roomId }, callback);
  };

  return {
    socket: socketRef.current,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
    joinRoom,
    leaveRoom,
  };
}

// Specialized hook for live streaming
export function useStreamSocket(streamId?: string) {
  const { socket, isConnected, emit, on, off, joinRoom, leaveRoom } = useSocket();
  const [viewers, setViewers] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<StreamReaction[]>([]);

  useEffect(() => {
    if (streamId && isConnected) {
      joinStream(streamId);
    }

    return () => {
      if (streamId) {
        leaveStream(streamId);
      }
    };
  }, [streamId, isConnected]);

  useEffect(() => {
    if (!isConnected) return;

    on('stream:viewers', (data: { streamId: string; count: number }) => {
      if (data.streamId === streamId) {
        setViewers(data.count);
      }
    });

    on('chat:message', (message: ChatMessage) => {
      if (message.streamId === streamId) {
        setMessages(prev => [...prev, message]);
      }
    });

    on('chat:reaction', (reaction: StreamReaction) => {
      if (reaction.streamId === streamId) {
        setReactions(prev => [...prev.slice(-9), reaction]); // Keep last 10 reactions
      }
    });

    return () => {
      off('stream:viewers');
      off('chat:message');
      off('chat:reaction');
    };
  }, [isConnected, streamId]);

  const joinStream = (id: string) => {
    joinRoom(`stream:${id}`);
  };

  const leaveStream = (id: string) => {
    leaveRoom(`stream:${id}`);
  };

  const sendMessage = (message: string) => {
    if (!streamId) return;
    
    emit('chat:send', {
      streamId,
      message,
      timestamp: new Date().toISOString(),
    });
  };

  const sendReaction = (type: string) => {
    if (!streamId) return;
    
    emit('chat:reaction', {
      streamId,
      type,
      timestamp: new Date().toISOString(),
    });
  };

  const sendRequest = (type: string, content: string) => {
    if (!streamId) return;
    
    emit('stream:request', {
      streamId,
      type,
      content,
      timestamp: new Date().toISOString(),
    });
  };

  return {
    viewers,
    messages,
    reactions,
    sendMessage,
    sendReaction,
    sendRequest,
    joinStream,
    leaveStream,
  };
}

// Specialized hook for chat functionality
export function useChatSocket(roomId?: string) {
  const { isConnected, emit, on, off, joinRoom, leaveRoom } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (roomId && isConnected) {
      joinRoom(roomId);
    }

    return () => {
      if (roomId) {
        leaveRoom(roomId);
      }
    };
  }, [roomId, isConnected]);

  useEffect(() => {
    if (!isConnected) return;

    on('chat:message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    on('chat:typing', (data: { userId: string; isTyping: boolean }) => {
      setTypingUsers(prev => 
        data.isTyping 
          ? [...prev, data.userId]
          : prev.filter(id => id !== data.userId)
      );
    });

    return () => {
      off('chat:message');
      off('chat:typing');
    };
  }, [isConnected]);

  const sendMessage = (message: string) => {
    emit('chat:send', {
      roomId,
      message,
      timestamp: new Date().toISOString(),
    });
  };

  const startTyping = () => {
    emit('chat:typing', { roomId, isTyping: true });
  };

  const stopTyping = () => {
    emit('chat:typing', { roomId, isTyping: false });
  };

  return {
    messages,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
  };
}