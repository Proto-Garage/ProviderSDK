'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OneWallet = exports.APIError = undefined;

var _request = require('./lib/request');

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _error = require('./lib/error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.APIError = _error.APIError;

var OneWallet = exports.OneWallet = (function () {

  /**
   * Create OneWallet instance
   * @param  {string} accessId  Provider access id
   * @param  {string} secretKey Provider secret key
   */

  function OneWallet(accessId, secretKey, baseUrl) {
    _classCallCheck(this, OneWallet);

    this.accessId = accessId;
    this.secretKey = secretKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Retrieve the user total balance
   * @param  {string} userId User/Player id
   * @return {Promise}
   */

  _createClass(OneWallet, [{
    key: 'totalBalance',
    value: function totalBalance(userId) {
      var opts = {
        method: 'GET',
        url: '/v1/users/' + userId + '?fields=totalBalance',
        baseUrl: this.baseUrl,
        accessId: this.accessId,
        secretKey: this.secretKey
      };

      return new _request.Request(opts).send().then(function (res) {
        return Promise.resolve(res.totalBalance);
      });
    }

    /**
     * Retrieve the user available balance
     * @param  {string} userId User/Player id
     * @return {Promise}
     */

  }, {
    key: 'availableBalance',
    value: function availableBalance(userId) {
      var opts = {
        method: 'GET',
        url: '/v1/users/' + userId + '?fields=availableBalance',
        baseUrl: this.baseUrl,
        accessId: this.accessId,
        secretKey: this.secretKey
      };

      return new _request.Request(opts).send().then(function (res) {
        return Promise.resolve(res.availableBalance);
      });
    }

    /**
     * Reserve balance for a specified game.
     * If called more than once, any previously reserved balance is returned
     * into the user balance pool.
     * @param  {string} userId      User/Player id
     * @param  {string} referenceId Reference id
     * @param  {number} amount      Amount to reserve
     * @return {Promise}
     */

  }, {
    key: 'debit',
    value: function debit(userId, referenceId, amount) {
      var transactionId = _nodeUuid2.default.v1();
      var opts = {
        method: 'PUT',
        url: '/v1/users/' + userId + '/transactions/' + transactionId,
        accessId: this.accessId,
        secretKey: this.secretKey,
        baseUrl: this.baseUrl,
        body: {
          type: 'debit',
          referenceId: referenceId,
          params: {
            amount: amount
          }
        }
      };

      return new _request.Request(opts).send();
    }

    /**
     * Apply changes in the users balance. Player cannot
     * lose more than he has reserved.
     * @param  {string} userId      User/Player id
     * @param  {string} referenceId Reference id
     * @param  {number} winloss     Win/Loss amount
     * @param  {number} turnover    Win/Loss amount
     * @param  {object} meta        Any options information
     * @return {Promise}
     */

  }, {
    key: 'credit',
    value: function credit(userId, referenceId, winloss, turnover) {
      var meta = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

      var transactionId = _nodeUuid2.default.v1();
      var opts = {
        method: 'PUT',
        url: '/v1/users/' + userId + '/transactions/' + transactionId,
        accessId: this.accessId,
        secretKey: this.secretKey,
        baseUrl: this.baseUrl,
        body: {
          type: 'credit',
          referenceId: referenceId,
          params: _extends({
            winloss: winloss,
            turnover: turnover
          }, meta)
        }
      };

      return new _request.Request(opts).send();
    }

    /**
     * Release reserved balance for a specified game
     * @param  {string} userId      User/Player id
     * @param  {string} referenceId Reference id
     * @return {Promise}
     */

  }, {
    key: 'rollback',
    value: function rollback(userId, referenceId) {
      var transactionId = _nodeUuid2.default.v1();
      var opts = {
        method: 'PUT',
        url: '/v1/users/' + userId + '/transactions/' + transactionId,
        accessId: this.accessId,
        secretKey: this.secretKey,
        baseUrl: this.baseUrl,
        body: {
          type: 'rollback',
          referenceId: referenceId
        }
      };

      return new _request.Request(opts).send();
    }
  }]);

  return OneWallet;
})();