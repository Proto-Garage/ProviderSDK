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
      let date = new Date().toUTCString(),
        method = self.options.method.toUpperCase(),
        body = (method === 'GET') ? null : JSON.stringify(self.options.body);
      let signature = hmacsign({
        method,
        url: self.options.url,
        body: body,
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
        json: false
      };

      if(method !== 'GET' && !body) {
        opts.body = body;
        opts.headers['Content-type'] = 'application/json';
      }

      request(opts, function(err, response) {
        if(err) return reject(err);
        resolve(response.body);
      });
    });
  }
}
