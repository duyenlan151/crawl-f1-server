import WebSocket from 'ws';
import { env } from '../config';
import { handleMessage } from './handlers';
import { logger } from './../utils/logger';

export const wss = new WebSocket.Server({ port: env.WS_PORT as number });

wss.on('connection', (ws) => {
  logger.info('Client connected');
  ws.on('message', (message) => handleMessage(ws, message));
  ws.on('close', () => logger.info('Client disconnected'));
  ws.on('error', (error) => logger.error(`WebSocket error: ${(error as Error).message}`));
});