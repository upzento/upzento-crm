import { useState, useEffect, useCallback } from 'react';
import socketClient from '@/lib/websocket/socket-client';

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId?: string;
  conversationId: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  metadata?: Record<string, any>;
}

interface UseChatOptions {
  onNewMessage?: (message: ChatMessage) => void;
  onMessageStatusChange?: (messageId: string, status: string) => void;
  onTypingStatus?: (userId: string, isTyping: boolean) => void;
  onError?: (error: any) => void;
}

export const useChat = (conversationId: string, options?: UseChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Connect to socket and join conversation room
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError(new Error('Authentication required'));
      setIsLoading(false);
      return;
    }

    try {
      // Connect socket
      const socket = socketClient.connectSocket(token);
      
      // Join conversation room
      socketClient.joinRoom(`conversation:${conversationId}`);
      
      // Fetch initial messages
      fetchMessages();
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to connect to chat'));
      setIsLoading(false);
    }
    
    // Cleanup on unmount
    return () => {
      socketClient.leaveRoom(`conversation:${conversationId}`);
    };
  }, [conversationId]);

  // Subscribe to socket events
  useEffect(() => {
    // Handle new message
    const handleNewMessage = (message: ChatMessage) => {
      if (message.conversationId === conversationId) {
        setMessages(prev => [...prev, message]);
        options?.onNewMessage?.(message);
      }
    };

    // Handle message status change
    const handleMessageStatus = (data: { messageId: string; status: string }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, status: data.status as any } 
            : msg
        )
      );
      options?.onMessageStatusChange?.(data.messageId, data.status);
    };

    // Handle typing status
    const handleTypingStatus = (data: { userId: string; isTyping: boolean }) => {
      setTypingUsers(prev => {
        if (data.isTyping && !prev.includes(data.userId)) {
          return [...prev, data.userId];
        } else if (!data.isTyping && prev.includes(data.userId)) {
          return prev.filter(id => id !== data.userId);
        }
        return prev;
      });
      options?.onTypingStatus?.(data.userId, data.isTyping);
    };

    // Handle errors
    const handleError = (err: any) => {
      setError(err instanceof Error ? err : new Error(err?.message || 'Chat error'));
      options?.onError?.(err);
    };

    // Subscribe to events
    socketClient.subscribe('new-message', handleNewMessage);
    socketClient.subscribe('message-status', handleMessageStatus);
    socketClient.subscribe('typing-status', handleTypingStatus);
    socketClient.subscribe('chat-error', handleError);

    // Cleanup subscriptions
    return () => {
      socketClient.unsubscribe('new-message', handleNewMessage);
      socketClient.unsubscribe('message-status', handleMessageStatus);
      socketClient.unsubscribe('typing-status', handleTypingStatus);
      socketClient.unsubscribe('chat-error', handleError);
    };
  }, [conversationId, options]);

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch messages from API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.upzento.com'}/chat/conversations/${conversationId}/messages`);
      const data = await response.json();
      
      if (data.data) {
        setMessages(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // Send a message
  const sendMessage = useCallback((content: string, type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT', metadata?: Record<string, any>) => {
    const message = {
      content,
      type,
      conversationId,
      metadata,
    };
    
    socketClient.sendMessage(`conversation:${conversationId}`, message);
  }, [conversationId]);

  // Set typing status
  const setTyping = useCallback((isTyping: boolean) => {
    socketClient.getSocket()?.emit('typing-status', {
      conversationId,
      isTyping,
    });
  }, [conversationId]);

  // Mark messages as read
  const markAsRead = useCallback((messageIds: string[]) => {
    socketClient.getSocket()?.emit('mark-as-read', {
      conversationId,
      messageIds,
    });
  }, [conversationId]);

  return {
    messages,
    isLoading,
    error,
    typingUsers,
    sendMessage,
    setTyping,
    markAsRead,
    refreshMessages: fetchMessages,
  };
};

export default useChat; 