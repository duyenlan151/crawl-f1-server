import WebSocket from 'ws';
import { scrapeF1Results } from '@/core/puppeteer/crawler';

export async function handleMessage(ws: WebSocket, message: WebSocket.RawData): Promise<void> {
  const { action } = JSON.parse(message.toString());
  if (action === 'startCrawl') {
    await scrapeF1Results(ws);
  }
}