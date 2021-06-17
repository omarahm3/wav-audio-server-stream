const winston = require('winston');
const config  = require('../../config.json');

const transportsConsoleSettings = new winston.transports.Console({
  prettyPrint : true,
  colorize    : true,
  json        : false,
  timestamp   : true,
});

const transportsFileSettings = new winston.transports.File({
  filename : 'logs/combined.log',
});

/**
 * Class for logging.
 *
 * @extends { winston.Logger }
 */
const logger = winston.createLogger({
  level  : config.debug.level,
  format : winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports        : [transportsConsoleSettings, transportsFileSettings],
  exceptionHandlers : [transportsConsoleSettings],
  exitOnError       : false,
});

module.exports = logger;
