'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Request = undefined;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _utilities = require('./utilities');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logger = (0, _debug2.default)('providersdk:request');

/** Class representing request. */

var Request = exports.Request = (function () {

  /**
   * Create a request
   * @param  {object} options           Options
   * @param  {object} options.method    Request method
   * @param  {object} options.url       Request url relative to the base url
   * @param  {object} options.accessId  Provider access id
   * @param  {object} options.secretKey Provider secret key
   * @param  {object} options.body      Request body
   */

  function Request(options) {
    _classCallCheck(this, Request);

    this.options = options;
    logger('request created', options);
  }

  _createClass(Request, [{
    key: 'backoff',
    value: function backoff() {
      var self = this;
      if (!self.backoff) {
        self.backoff = {
          current: _config2.default.backoff.initialDelay,
          next: _config2.default.backoff.initialDelay,
          count: 0
        };
      }
      return new _bluebird2.default(function (resolve, reject) {
        setTimeout(function () {
          var next = self.backoff.current + self.backoff.next;
          self.backoff.current = self.backoff.next;
          self.backoff.next = next;
          self.backoff.count++;
          if (self.backoff.count >= _config2.default.backoff.maxNumBackoff) {
            return reject(new Error('Maximum number of backoffs reached'));
          }
          resolve();
        }, self.backoff.current);
      });
    }

    /**
     * Send the request and retry if communication error is encountered
     * @return {Promise}
     */

  }, {
    key: 'send',
    value: function send() {
      var self = this;
      return new _bluebird2.default(function (resolve, reject) {
        self.sendRequest().then(resolve).catch(function (err) {
          logger('request error', err);
          if (!self.options.backoff) {
            return reject(err);
          }
          self.backoff().then(function () {
            self.send();
          }).catch(reject);
        });
      });
    }

    /**
     * Send the request
     * @return {Promise}
     */

  }, {
    key: 'sendRequest',
    value: function sendRequest() {
      var self = this;
      return new _bluebird2.default(function (resolve, reject) {
        var date = new Date().toUTCString(),
            method = self.options.method.toUpperCase(),
            body = method === 'GET' ? null : JSON.stringify(self.options.body);

        var signature = (0, _utilities.hmacsign)({
          method: method,
          url: self.options.url,
          body: body,
          date: date,
          secretKey: self.options.secretKey
        });
        var opts = {
          baseUrl: _config2.default.url,
          url: self.options.url,
          method: method,
          headers: {
            Date: date,
            Authorization: 'OW ' + self.options.accessId + ':' + signature
          },
          timeout: _config2.default.timeout,
          json: false
        };

        if (method !== 'GET' && body) {
          opts.body = body;
          opts.headers['Content-type'] = 'application/json';
        }

        (0, _request2.default)(opts, function (err, response) {
          if (err) return reject(err);
          try {
            var result = JSON.parse(response.body);
            logger('response received', result);
            resolve(result);
          } catch (err) {
            logger('error parsing ' + response.body);
            resolve({});
          }
        });
      });
    }
  }]);

  return Request;
})();