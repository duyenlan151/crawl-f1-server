import fs from 'fs';
import path from 'path';

// Log file path
const LOG_DIR = path.resolve(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

// Ensure the logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Logs messages to both console and a file.
 * @param level Log level ('INFO', 'WARN', 'ERROR')
 * @param message Log message
 */
function log(level: 'INFO' | 'WARN' | 'ERROR', message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;

  // Display in the console
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

  // Append the log to the file
  fs.appendFileSync(LOG_FILE, logMessage + '\n', 'utf8');
}

// Export the logger
export const logger = {
  info: (message: string) => log('INFO', message),
  warn: (message: string) => log('WARN', message),
  error: (message: string) => log('ERROR', message),
};
