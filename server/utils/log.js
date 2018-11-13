const  chalk = require('chalk');
const moment = require('moment');

const log = (color, level) => (message) => {
  const prefix = `${moment().format()} [${level}] `;
  if (typeof message === 'object') {
    /*eslint-disable-next-line*/
    return console[level](chalk[color]('%o'), `${prefix}${message}`);
  }
  /*eslint-disable-next-line*/
  return console[level](chalk[color](`${prefix}${message}`));
};

const debug = log('white', 'debug');

const info = log('white', 'info');

const warn = log('yellow', 'warn');

const error = log('red', 'error');

module.exports = {
  log,
  debug,
  info,
  warn,
  error
};
