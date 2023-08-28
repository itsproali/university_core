/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'http';
import app from './app';
import config from './config';
import logger from './shared/logger';

// Uncaught exception
process.on('uncaughtException', (err: any) => {
  logger.error('UNCAUGHT EXCEPTION! 💣 Shutting down...');
  logger.error(err.message);
  process.exit(1);
});

async function bootstrap() {
  const server: Server = app.listen(config.PORT, () => {
    logger.info(`Server listening on port ${config.PORT}`);
  });

  // Unhandled promise rejection
  process.on('unhandledRejection', (err: any) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.message);
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });

  // SIGTERM
  process.on('SIGTERM', () => {
    logger.info('SIGTERM RECEIVED 🚦 Shutting down gracefully');
    if (server) {
      server.close();
    }
  });
}

bootstrap();
