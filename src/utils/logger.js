import  *  as  winston  from  'winston';
import  DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateTransport = (
    level = 'info',
    duration = '3d',
  ) => {
  const transport = {
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.prettyPrint(),
      winston.format.splat(),
      winston.format.colorize()
    ),
    filename: `${__dirname}/../../logs/${level}/%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: duration
  };

  if (level == 'error') {
    transport.level = 'error';
  }
  return transport;
}

const logger = winston.createLogger({
  transports: [
    new DailyRotateFile(generateTransport('info')),
    new DailyRotateFile(generateTransport('error', '10d')),
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(info => `[${info.level}]: ${info.message}`)
      )
    })
  ]
});

export default logger;