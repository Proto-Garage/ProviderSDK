'use strict';

import {Request} from './lib/request';
import uuid      from 'node-uuid';

export class OneWallet {
  constructor(accessId, secretKey) {
    this.accessId = accessId;
    this.secretKey = secretKey;
  }

  totalBalance(userId) {
    let opts = {
      method: 'GET',
      url: `/v1/users/${userId}?fields=totalBalance`,
      accessId: this.accessId,
      secretKey: this.secretKey
    };

    return new Request(opts).send().then((res) => Promise.resolve(res.totalBalance));
  }

  availableBalance(userId) {
    let opts = {
      method: 'GET',
      url: `/v1/users/${userId}?fields=availableBalance`,
      accessId: this.accessId,
      secretKey: this.secretKey
    };

    return new Request(opts).send().then((res) => Promise.resolve(res.availableBalance));
  }

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
