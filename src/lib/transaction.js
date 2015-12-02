'use strict';

export const TRANSACTION_TYPES = {
  DEBIT: 'debit',
  CREDIT: 'credit',
  ROLLBACK: 'rollback'
};

export class Transaction {
  constructor(type, payload, options) {
    if(!TRANSACTION_TYPES[type]) {
      throw new Error(`Transaction type ${type} not supported`);
    }

    this.payload = payload;
    this.options = options;
  }
}
