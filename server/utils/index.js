const log = require('./log');

/**
 * 合并数组去重
 * @param {array} arr1 
 * @param {array} arr2 
 * @return {array}
 */
const mergeArr = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return  log.error('the argument must be array');
  }
  return Array.from(new Set(arr1.concat(arr2)));
};

module.exports = {
  mergeArr
};