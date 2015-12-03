'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OneWallet = undefined;

var _request = require('./lib/request');

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OneWallet = exports.OneWallet = (function () {

  /**
   * Create OneWallet instance
   * @param  {string} accessId  Provider access id
   * @param  {string} secretKey Provider secret key
   */

  function OneWallet(accessId, secretKey) {
    _classCallCheck(this, OneWallet);

    this.accessId = accessId;
    this.secretKey = secretKey;
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
     * @param  {string} userId User/Player id
     * @param  {string} gameId Game id
     * @param  {number} amount Amount to reserve
     * @return {Promise}
     */

  }, {
    key: 'debit',
    value: function debit(userId, gameId, amount) {
      var transactionId = _nodeUuid2.default.v1();
      var opts = {
        method: 'PUT',
        url: '/v1/users/' + userId + '/games/' + gameId + '/transactions/' + transactionId,
        accessId: this.accessId,
        secretKey: this.secretKey,
        body: {
          type: 'debit',
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
     * @param  {string} userId User/Player id
     * @param  {string} gameId Game id
     * @param  {number} delta  Win/Loss amount
     * @return {Promise}
     */

  }, {
    key: 'credit',
    value: function credit(userId, gameId, delta) {
      var transactionId = _nodeUuid2.default.v1();
      var opts = {
        method: 'PUT',
        url: '/v1/users/' + userId + '/games/' + gameId + '/transactions/' + transactionId,
        accessId: this.accessId,
        secretKey: this.secretKey,
        body: {
          type: 'credit',
          params: {
            delta: delta
          }
        }
      };

      return new _request.Request(opts).send();
    }

    /**
     * Release reserved balance for a specified game
     * @param  {string} userId User/Player id
     * @param  {string} gameId Game id
     * @return {Promise}
     */

  }, {
    key: 'rollback',
    value: function rollback(userId, gameId) {
      var transactionId = _nodeUuid2.default.v1();
      var opts = {
        method: 'PUT',
        url: '/v1/users/' + userId + '/games/' + gameId + '/transactions/' + transactionId,
        accessId: this.accessId,
        secretKey: this.secretKey,
        body: {
          type: 'rollback'
        }
      };

      return new _request.Request(opts).send();
    }
  }]);

  return OneWallet;
})();