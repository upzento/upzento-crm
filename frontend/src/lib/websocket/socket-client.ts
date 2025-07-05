import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Connect to WebSocket server
 * @param token Authentication token
 * @returns Socket instance
 */
export const connectSocket = (token: string): Socket => {
  if (socket && socket.connected) return socket;
  
  // Disconnect existing socket if it exists
  if (socket) {
    socket.disconnect();
  }
  
  // Create new socket connection
  socket = io(process.env.NEXT_PUBLIC_WS_URL || 'wss://api.upzento.com', {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  });
  
  // Set up event handlers
  socket.on('connect', () => {
    console.log('WebSocket connected');
  });
  
  socket.on('disconnect', (reason) => {
    console.log(`WebSocket disconnected: ${reason}`);
  });
  
  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  
  socket.on('reconnect', (attemptNumber) => {
    console.log(`WebSocket reconnected after ${attemptNumber} attempts`);
  });
  
  socket.on('reconnect_error', (error) => {
    console.error('WebSocket reconnection error:', error);
  });
  
  socket.on('reconnect_failed', () => {
    console.error('WebSocket reconnection failed');
  });
  
  return socket;
};

/**
 * Disconnect from WebSocket server
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get current socket instance
 * @returns Socket instance or null if not connected
 */
export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * Join a room
 * @param room Room name
 */
export const joinRoom = (room: string): void => {
  if (socket) {
    socket.emit('join-room', { room });
  }
};

/**
 * Leave a room
 * @param room Room name
 */
export const leaveRoom = (room: string): void => {
  if (socket) {
    socket.emit('leave-room', { room });
  }
};

/**
 * Send a message to a room
 * @param room Room name
 * @param message Message content
 */
export const sendMessage = (room: string, message: any): void => {
  if (socket) {
    socket.emit('send-message', { room, message });
  }
};

/**
 * Subscribe to events
 * @param event Event name
 * @param callback Callback function
 */
export const subscribe = (event: string, callback: (data: any) => void): void => {
  if (socket) {
    socket.on(event, callback);
  }
};

/**
 * Unsubscribe from events
 * @param event Event name
 * @param callback Callback function
 */
export const unsubscribe = (event: string, callback?: (data: any) => void): void => {
  if (socket) {
    if (callback) {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }
  }
};

export default {
  connectSocket,
  disconnectSocket,
  getSocket,
  joinRoom,
  leaveRoom,
  sendMessage,
  subscribe,
  unsubscribe,
}; 