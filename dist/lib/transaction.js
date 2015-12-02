'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TRANSACTION_TYPES = exports.TRANSACTION_TYPES = {
  DEBIT: 'debit',
  CREDIT: 'credit',
  ROLLBACK: 'rollback'
};

var Transaction = exports.Transaction = function Transaction(type, payload, options) {
  _classCallCheck(this, Transaction);

  if (!TRANSACTION_TYPES[type]) {
    throw new Error('Transaction type ' + type + ' not supported');
  }

  this.payload = payload;
  this.options = options;
};