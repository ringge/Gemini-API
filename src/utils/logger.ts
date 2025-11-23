import pino from 'pino';

/**
 * Logger instance for gemini-webapi
 */
export const logger = pino({
  name: 'gemini-webapi',
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:standard',
    },
  },
});

/**
 * Set the log level for gemini-webapi
 * @param level - Log level: 'trace', 'debug', 'info', 'warn', 'error', 'fatal'
 */
export function setLogLevel(level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'): void {
  logger.level = level;
}
