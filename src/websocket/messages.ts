import { WebSocket } from 'ws';
import { logger } from '../utils/logger';

export function sendMessage(ws: WebSocket, progress: number, message: string): void {
  console.log(`[${new Date().toISOString()}] Sending: ${progress}% - ${message}`);
  logger.info(`[${new Date().toISOString()}] Sending: ${progress}% - ${message}`);
  ws.send(JSON.stringify({ progress, message }));
}