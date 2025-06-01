import { io } from 'socket.io-client';

export function connectToGameSocket(username, gameId) {
  return io('http://localhost:3000', {
    query: { username, gameId },
    transports: ['websocket']
  });
}
