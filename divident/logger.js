'use strict';
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const logDir = '/mnt/ebs/TrxDividend/'; // log
//const logDir = "C:\\Users\\shangxing\\Desktop\\JackServer"
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD'
});

const stdoutTransport = new transports.Console({
  level: 'info',
  format: format.combine(
      format.colorize(),
      format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
      )
  )
});

exports.logger = createLogger({
  // change level if in dev environment versus production
  level: env === 'development' ? 'verbose' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: isInProdMode() ?  [dailyRotateFileTransport] : [stdoutTransport,dailyRotateFileTransport],
});

function isInProdMode() {
  var isProd = false;
  process.argv.forEach(function (val, index, array) {
      if (val == 'prod' || val == "Prod" || val == "PROD") {
        isProd = true;
      }
  });
  return isProd;
}

