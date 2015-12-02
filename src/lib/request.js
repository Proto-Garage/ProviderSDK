'use strict';

import request from 'request';
import config from '../config';

export class Request {
  constructor(options) {
    this.options = options;
  }

  send () {
    let self = this;
    return new Promise(function(resolve, reject) {
      let opts = {
        baseUrl: config.url,
        url: self.options.url,
        method: self.options.method,
        json: true
      };
      request(opts, function(err, response) {
        if(err) return reject(err);
        resolve(response.body);
      });
    });
  }
}
