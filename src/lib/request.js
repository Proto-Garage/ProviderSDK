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

  backoff () {
    let self = this;
    if(!self.backoff) {
      self.backoff = {
        current: config.backoff.initialDelay,
        next: config.backoff.initialDelay,
        count: 0
      };
    }
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        let next = self.backoff.current + self.backoff.next;
        self.backoff.current = self.backoff.next;
        self.backoff.next = next;
        self.backoff.count++;
        if(self.backoff.count >= config.backoff.maxNumBackoff) {
          return reject(new Error('Maximum number of backoffs reached'));
        }
        resolve();
      }, self.backoff.current);
    });
  }

  /**
   * Send the request and retry if communication error is encountered
   * @return {Promise}
   */
  send () {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.sendRequest().then(resolve).catch(function(err) {
        logger('request error', err);
        if(!self.options.backoff) {
          return reject(err);
        }
        self.backoff().then(function() {
          self.send();
        }).catch(reject);
      });
    });
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
        timeout: config.timeout,
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
          logger(`error parsing ${response.body}`);
          resolve({});
        }
      });
    });
  }
}
