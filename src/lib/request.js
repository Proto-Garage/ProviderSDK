'use strict';

import request    from 'request';
import config     from '../../config';
import {hmacsign} from './utilities';

export class Request {
  constructor(options) {
    this.options = options;
  }

  send () {
    return this._send();
  }

  _send() {
    let self = this;
    return new Promise(function(resolve, reject) {
      let date = new Date().toUTCString();
      let signature = hmacsign({
        method: self.options.method.toUpperCase(),
        url: self.options.url,
        body: (self.options.method.toUpperCase() === 'GET') ? null : self.options.body,
        date,
        secretKey: self.options.secretKey
      });
      let opts = {
        baseUrl: config.url,
        url: self.options.url,
        method: self.options.method,
        headers: {
          Date: date,
          Authorization: `OW ${self.options.accessId}:${signature}`
        },
        json: true
      };
      request(opts, function(err, response) {
        if(err) return reject(err);
        resolve(response.body);
      });
    });
  }
}
