'use strict';

import { Request }  from './lib/request';
import uuid         from 'node-uuid';
import { APIError } from './lib/error';

export { APIError };

export class OneWallet {

  /**
   * Create OneWallet instance
   * @param  {string} accessId  Provider access id
   * @param  {string} secretKey Provider secret key
   */
  constructor(accessId, secretKey, baseUrl) {
    this.accessId = accessId;
    this.secretKey = secretKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Retrieve the user total balance
   * @param  {string} userId User/Player id
   * @return {Promise}
   */
  totalBalance(userId) {
    let opts = {
      method: 'GET',
      url: `/v1/users/${userId}?fields=totalBalance`,
      baseUrl: this.baseUrl,
      accessId: this.accessId,
      secretKey: this.secretKey
    };

    return new Request(opts).send().then((res) => Promise.resolve(res.totalBalance));
  }

  /**
   * Retrieve the user available balance
   * @param  {string} userId User/Player id
   * @return {Promise}
   */
  availableBalance(userId) {
    let opts = {
      method: 'GET',
      url: `/v1/users/${userId}?fields=availableBalance`,
      baseUrl: this.baseUrl,
      accessId: this.accessId,
      secretKey: this.secretKey
    };

    return new Request(opts).send().then((res) => Promise.resolve(res.availableBalance));
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
  debit(userId, referenceId, amount) {
    let transactionId = uuid.v1();
    let opts = {
      method: 'PUT',
      url: `/v1/users/${userId}/transactions/${transactionId}`,
      accessId: this.accessId,
      secretKey: this.secretKey,
      baseUrl: this.baseUrl,
      body: {
        type: 'debit',
        referenceId,
        params: {
          amount
        }
      }
    };

    return new Request(opts).send();
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
  credit(userId, referenceId, winloss, turnover, meta = {}) {
    let transactionId = uuid.v1();
    let opts = {
      method: 'PUT',
      url: `/v1/users/${userId}/transactions/${transactionId}`,
      accessId: this.accessId,
      secretKey: this.secretKey,
      baseUrl: this.baseUrl,
      body: {
        type: 'credit',
        referenceId,
        params: Object.assign({
          winloss,
          turnover
        }, meta)
      }
    };

    return new Request(opts).send();
  }

  /**
   * Release reserved balance for a specified game
   * @param  {string} userId      User/Player id
   * @param  {string} referenceId Reference id
   * @return {Promise}
   */
  rollback(userId, referenceId) {
    let transactionId = uuid.v1();
    let opts = {
      method: 'PUT',
      url: `/v1/users/${userId}/transactions/${transactionId}`,
      accessId: this.accessId,
      secretKey: this.secretKey,
      baseUrl: this.baseUrl,
      body: {
        type: 'rollback',
        referenceId
      }
    };

    return new Request(opts).send();
  }
}
