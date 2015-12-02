'use strict';

import request    from 'request';
import config     from '../../config';
import {hmacsign} from './utilities';
import debug      from 'debug';
import Promise    from 'bluebird';

const logger = debug('providersdk:request');

/** Class representing request. */
export class Request {

  /**
   * Create a request
   * @param  {object} options           Options
   * @param  {object} options.method    Request method
   * @param  {object} options.url       Request url relative to the base url
   * @param  {object} options.accessId  Provider access id
   * @param  {object} options.secretKey Provider secret key
   * @param  {object} options.body      Request body
   */
  constructor(options) {
    this.options = options;
    logger('request created', options);
  }

  /**
   * Send the request and retry if communication error is encountered
   * @return {Promise}
   */
  send () {
    return this.sendRequest();
  }

  /**
   * Send the request
   * @return {Promise}
   */
  sendRequest() {
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
        method: method,
        headers: {
          Date: date,
          Authorization: `OW ${self.options.accessId}:${signature}`
        },
        json: false
      };

      if(method !== 'GET' && body) {
        opts.body = body;
        opts.headers['Content-type'] = 'application/json';
      }

      request(opts, function(err, response) {
        if(err) return reject(err);
        try {
          let result = JSON.parse(response.body);
          logger('response received', result);
          resolve(result);
        } catch(err) {
          reject(err);
        }
      });
    });
  }
}
