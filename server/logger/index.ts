import * as winston from 'winston';

var loggers: Array<winston.TransportInstance> = [];
var consoleLogger = new winston.transports.Console({
  level: 'info',
  handleExceptions: true,
  json: false,
  prettyPrint: true,
  colorize: true
});
loggers.push(consoleLogger);
loggers.push(new winston.transports.File({ filename: 'all.log', level: 'warn' }))

export var logger = new winston.Logger({
  levels: {
    trace: 0,
    input: 1,
    verbose: 2,
    prompt: 3,
    debug: 4,
    info: 5,
    data: 6,
    help: 7,
    warn: 8,
    error: 9
  },
  colors: {
    trace: 'magenta',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    debug: 'blue',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    error: 'red'
  },
  transports: loggers,
  exitOnError: false
});

export var profilingLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info'
    })
  ],
  exitOnError: false
});

export var loggerStream: Object = {
  write: function(message: string) {
    logger.info(message.slice(0, -1));
  }
};