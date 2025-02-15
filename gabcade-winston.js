// gabcade-winston.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const util = require('util');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');

const winston = require('winston');
const moment = require('moment');

module.exports = (config) => {
  var gabcadeFormat = {
    transform: (info) => {
      var level = info.level;
      delete info.level;

      var message = `${moment(info.timestamp).format('HH:mm:ss.SSS')} ${info.message}`;
      delete info.timestamp;
      delete info.message;

      var keys = Object.keys(info);
      if (keys.length) {
        message += ' {';
        var isFirst = true;
        keys.forEach((key) => {
          message += `${isFirst ? ' ' : ', '}${key}: ${util.inspect(info[key], { depth: 2 })}`;
          isFirst = false;
        });
        message += ' }';
      }

      return {
        level: level,
        message: message
      };
    }
  };

  var logDirectory = path.join(config.root, 'logs');
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  var applicationLogStream = rfs('gabcade.log', {
    size: '25M',
    interval: '1d',
    path: logDirectory,
    compress: 'gzip'
  });
  var applicationErrorStream = rfs('gabcade-error.log', {
    size: '25M',
    interval: '1d',
    path: logDirectory,
    compress: 'gzip'
  });

  return winston
  .createLogger({
    level: config.logLevel,
    format: winston.format.json(),
    transports: [
      new winston.transports.Stream({
        stream: applicationErrorStream,
        level: 'error'
      }),
      new winston.transports.Stream({
        stream: applicationLogStream
      }),
      new winston.transports.Console({
        colorize: true,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          gabcadeFormat,
          winston.format.simple()
        )
      })
    ]
  });
};