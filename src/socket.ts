import http from 'http';
import { Server } from 'socket.io';

import { app } from './app';

const server = http.createServer(app);
const io = new Server(server);

import './websocket/ChatService';

export { server, io };
