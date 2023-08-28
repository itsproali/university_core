/* eslint-disable no-console */
import fs from 'fs';
import { Logger, createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, printf, colorize, prettyPrint } = format;

// Format log messages
const myFormat = printf(({ level, message }) => {
  const date = new Date().toLocaleDateString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });

  return `${level}: ${message} ${date}`;
});

const infoTransport = new DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '1d',
  level: 'info',
});

infoTransport.on('rotate', function (oldFilename) {
  // delete old files with fs.unlink
  fs.unlink(oldFilename, err => {
    if (err) {
      console.error('Error deleting old log file:', err);
    } else {
      console.log('Old log file deleted:', oldFilename);
    }
  });
});

const errorTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '1d',
  level: 'error',
});

errorTransport.on('rotate', function (oldFilename) {
  // delete old files with fs.unlink
  fs.unlink(oldFilename, err => {
    if (err) {
      console.error('Error deleting old log file:', err);
    } else {
      console.log('Old log file deleted:', oldFilename);
    }
  });
});

// Create logger
const logger: Logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    printf(
      ({ level, message, timestamp }) => `${timestamp} ${level} ${message}`
    ),
    prettyPrint()
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), myFormat),
    }),
    infoTransport,
    errorTransport,
  ],
});

// if (config.isDevelopment) {
//   logger.add(
//     new DailyRotateFile({
//       filename: "logs/combined-%DATE%.log",
//       datePattern: "YYYY-MM-DD-HH",
//       zippedArchive: true,
//       maxSize: "20m",
//       maxFiles: "1d",
//       level: "info",
//     })
//   );
//   logger.add(
//     new DailyRotateFile({
//       filename: "logs/error-%DATE%.log",
//       datePattern: "YYYY-MM-DD-HH",
//       zippedArchive: true,
//       maxSize: "20m",
//       maxFiles: "1d",
//       level: "error",
//     })
//   );
// }

export default logger;
