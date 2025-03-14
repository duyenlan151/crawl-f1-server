import fs from 'fs';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV || 'development';

const LOG_DIR = path.resolve(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

if (NODE_ENV === 'development') {
  // Ensure the logs directory exists
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

/**
 * Logs messages to both console and a file
 * @param level Log level ('INFO', 'WARN', 'ERROR')
 * @param message Log message
 */
function log(level: 'INFO' | 'WARN' | 'ERROR', message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;

  // Always log to console
  switch (level) {
    case 'INFO':
      console.log(logMessage);
      break;
    case 'WARN':
      console.warn(logMessage);
      break;
    case 'ERROR':
      console.error(logMessage);
      break;
  }

  // Only log to file in development
  if (NODE_ENV === 'development') {
    fs.appendFileSync(LOG_FILE, logMessage + '\n', 'utf8');
  }
}

// Export the logger
export const logger = {
  info: (message: string) => log('INFO', message),
  warn: (message: string) => log('WARN', message),
  error: (message: string) => log('ERROR', message),
};
