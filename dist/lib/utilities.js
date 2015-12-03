'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hmacsign = hmacsign;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generate request signature
 *
 * @param  {object} info           Relevant information
 * @param  {string} info.method    Request method
 * @param  {string} info.url       Request url relative to the base url
 * @param  {string} info.secretKey Secret key
 * @param  {string} info.body      Request body
 * @param  {string} info.date      Date in UTC format
 * @return {string}                Signature
 */
function hmacsign(info) {
  var toSign = info.method.toUpperCase() + '\n',
      md5 = _crypto2.default.createHash('md5'),
      hmac = _crypto2.default.createHmac('sha1', info.secretKey);

  if (info.body) {
    md5.update(info.body);
    toSign += md5.digest('base64') + '\n';
  } else {
    toSign += '\n';
  }
  toSign += (info.date ? info.date : new Date().toUTCString()) + '\n';
  toSign += info.url;

  hmac.update(toSign);
  return hmac.digest('base64');
}