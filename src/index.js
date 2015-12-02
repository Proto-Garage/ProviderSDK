'use strict';

import {Request} from './lib/request';
import uuid      from 'node-uuid';

export class OneWallet {

  /**
   * Create OneWallet instance
   * @param  {string} accessId  Provider access id
   * @param  {string} secretKey Provider secret key
   */
  constructor(accessId, secretKey) {
    this.accessId = accessId;
    this.secretKey = secretKey;
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
      accessId: this.accessId,
      secretKey: this.secretKey
    };

    return new Request(opts).send().then((res) => Promise.resolve(res.availableBalance));
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
  debit(userId, gameId, amount) {
    let transactionId = uuid.v1();
    let opts = {
      method: 'PUT',
      url: `/v1/users/${userId}/games/${gameId}/transactions/${transactionId}`,
      accessId: this.accessId,
      secretKey: this.secretKey,
      body: {
        type: 'debit',
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
   * @param  {string} userId User/Player id
   * @param  {string} gameId Game id
   * @param  {number} delta  Win/Loss amount
   * @return {Promise}
   */
  credit(userId, gameId, delta) {
    let transactionId = uuid.v1();
    let opts = {
      method: 'PUT',
      url: `/v1/users/${userId}/games/${gameId}/transactions/${transactionId}`,
      accessId: this.accessId,
      secretKey: this.secretKey,
      body: {
        type: 'credit',
        params: {
          delta
        }
      }
    };

    return new Request(opts).send();
  }

  /**
   * Release reserved balance for a specified game
   * @param  {string} userId User/Player id
   * @param  {string} gameId Game id
   * @return {Promise}
   */
  rollback(userId, gameId) {
    let transactionId = uuid.v1();
    let opts = {
      method: 'PUT',
      url: `/v1/users/${userId}/games/${gameId}/transactions/${transactionId}`,
      accessId: this.accessId,
      secretKey: this.secretKey,
      body: {
        type: 'rollback'
      }
    };

    return new Request(opts).send();
  }
}
