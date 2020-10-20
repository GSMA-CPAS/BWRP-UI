'use strict';

let winston = require('winston');

module.exports = function(config) {

    const transports = [];

    let logConsole = true;
    let logLevel = 'info';
    let logFile = '';

    if (!config.log) {
        console.warn("WARNING: No logging configuration found!");
    } else {
        logConsole = config.log.console;
        logLevel = config.log.level;
        logFile = config.log.file;
    }

    if (logFile) {
        transports.push(new winston.transports.File({
                level: logLevel,
                filename: logFile,
                handleExceptions: true
            })
        );
    }

    if (!process.env.NODE_ENV || (process.env.NODE_ENV === 'development' || logConsole)) {
        transports.push(new winston.transports.Console({
                level: logLevel,
                handleExceptions: true
            })
        );
    }

    /*return winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.splat(),
            winston.format.json()
        ),
        transports: transports,
        exitOnError: false
    });*/

    return winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.splat(),
            winston.format.printf((info) => {
                return JSON.stringify({timestamp: info.timestamp, level: info.level, message: info.message});
            })
        ),
        transports: transports,
        exitOnError: false
    });

};