'use strict';

import crypto from 'crypto';

export function hmacsign(info) {
  let toSign = info.method.toUpperCase() + '\n',
    md5 = crypto.createHash('md5'),
    hmac = crypto.createHmac('sha1', info.secretKey);

  if (info.data) {
    md5.update(info.data);
    toSign += md5.digest('base64') + '\n';
  } else {
    toSign += '\n';
  }
  toSign += info.date + '\n';
  toSign += info.url;

  hmac.update(toSign);
  return hmac.digest('base64');
}
