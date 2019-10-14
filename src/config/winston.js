import appRoot from 'app-root-path';
import { createLogger, format, transports } from 'winston';

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false,
  format: format.combine(format.colorize(), format.simple()),
});

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

export default logger;
