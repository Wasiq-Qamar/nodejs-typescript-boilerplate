import winston from 'winston';

class Logger {
  private static logger: winston.Logger;

  static getLogger(): winston.Logger {
    if (!this.logger) {
      const {combine, printf, timestamp, colorize, align} = winston.format;

      this.logger = winston.createLogger({
        level: 'info',
        format: combine(
          colorize({all: true}),
          timestamp({
            format: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
          }),
          align(),
          printf(
            ({level, message, timestamp}) =>
              `[${timestamp}] | ${level}: ${(message as string).trim()}`
          )
        ),
        transports: [new winston.transports.Console()],
      });
    }
    return this.logger;
  }

  static cronLog(payload: {
    type: 'cron-error' | 'cron-info';
    message: string;
    importantInfo?: string;
    jobName?: string;
    nextExecution?: Date;
    timeTaken?: number;
  }): void {
    const {type, message, jobName, nextExecution, importantInfo, timeTaken} =
      payload;

    if (type === 'cron-info') {
      console.info(
        '\x1b[32m%s\x1b[0m',
        `${jobName} ${message} | ${
          importantInfo
            ? '\x1b[36m' + importantInfo.toUpperCase() + '\x1b[32m |'
            : ''
        }${timeTaken ? ` Time Taken: ${timeTaken} ms |` : ''} ${nextExecution ? 'Next Execution: ' + nextExecution : ''}`
      );
    } else {
      console.error(
        '\x1b[31m%s\x1b[0m',
        `${jobName} ${message} | ${
          importantInfo
            ? '\x1b[36m' + importantInfo.toUpperCase() + '\x1b[32m |'
            : ''
        }${timeTaken ? ` Time Taken: ${timeTaken} ms |` : ''} ${nextExecution ? 'Next Execution: ' + nextExecution : ''}`
      );
    }
  }
}

export {Logger};
