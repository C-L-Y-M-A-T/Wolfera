import {
  ConsoleLogger,
  Inject,
  Injectable,
  LogLevel,
  Scope,
} from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { config } from 'src/config';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  constructor(@Inject(INQUIRER) private parentClass: object) {
    super(parentClass.constructor.name, {
      logLevels:
        config.env === 'development'
          ? ['log', 'debug', 'error', 'verbose', 'fatal', 'warn']
          : ['log', 'warn', 'error'],
    });
  }

  log(message: string, ...args: any[]) {
    this.logArguments('log', message, args);
  }

  error(message: string, ...args: any[]) {
    this.logArguments('error', message, args);
  }

  warn(message: string, ...args: any[]) {
    this.logArguments('warn', message, args);
  }

  debug(message: string, ...args: any[]) {
    this.logArguments('debug', message, args);
  }

  verbose(message: string, ...args: any[]) {
    this.logArguments('verbose', message, args);
  }

  fatal(message: string, ...args: any[]) {
    this.logArguments('fatal', message, args);
  }

  private logArguments(type: LogLevel, message: string, args: any[]) {
    super[type](message);
    args.forEach((arg) => {
      super[type](arg);
    });
  }
}
