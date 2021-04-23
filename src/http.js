import parseConstructorArguments from './parseConstructorArguments';
import VError from './verror';
import { inheritsFrom } from './utils';

function extendVError(_this, ctor, code, className, args) {
  if (!(_this instanceof ctor)) {
    return new ctor(...args);
  }

  const { options, shortMessage } = parseConstructorArguments(...args);

  options.meta = {
    code,
    className,
    ...options.meta
  }

  return VError.call(
    _this,
    options,
    shortMessage
  );
}

// 400 - Bad Request
function BadRequest(...args) {
  return extendVError(this, BadRequest, 400, 'bad-request', args);
}
inheritsFrom(BadRequest, VError);
BadRequest.prototype.name = 'BadRequest';

// 401 - Not Authenticated
function NotAuthenticated(...args) {
  return extendVError(this, NotAuthenticated, 401, 'not-authenticated', args);
}
inheritsFrom(NotAuthenticated, VError);
NotAuthenticated.prototype.name = 'NotAuthenticated';

// 402 - Payment Error
function PaymentError(...args) {
  return extendVError(this, PaymentError, 402, 'payment-error', args);
}
inheritsFrom(PaymentError, VError);
PaymentError.prototype.name = 'PaymentError';

// 403 - Forbidden
function Forbidden(...args) {
  return extendVError(this, Forbidden, 403, 'forbidden', args);
}
inheritsFrom(Forbidden, VError);
Forbidden.prototype.name = 'Forbidden';

// 404 - Not Found
function NotFound(...args) {
  return extendVError(this, NotFound, 404, 'not-found', args);
}
inheritsFrom(NotFound, VError);
NotFound.prototype.name = 'NotFound';

// 405 - Method Not Allowed
function MethodNotAllowed(...args) {
  return extendVError(this, MethodNotAllowed, 405, 'method-not-allowed', args);
}
inheritsFrom(MethodNotAllowed, VError);
MethodNotAllowed.prototype.name = 'MethodNotAllowed';

// 406 - Not Acceptable
function NotAcceptable(...args) {
  return extendVError(this, NotAcceptable, 406, 'not-acceptable', args);
}
inheritsFrom(NotAcceptable, VError);
NotAcceptable.prototype.name = 'NotAcceptable';

// 408 - Timeout
function Timeout(...args) {
  return extendVError(this, Timeout, 408, 'timeout', args);
}
inheritsFrom(Timeout, VError);
Timeout.prototype.name = 'Timeout';

// 409 - Conflict
function Conflict(...args) {
  return extendVError(this, Conflict, 409, 'conflict', args);
}
inheritsFrom(Conflict, VError);
Conflict.prototype.name = 'Conflict';

// 410 - Gone
function Gone(...args) {
  return extendVError(this, Gone, 410, 'gone', args);
}
inheritsFrom(Gone, VError);
Gone.prototype.name = 'Gone';

// 411 - Length Required
function LengthRequired(...args) {
  return extendVError(this, LengthRequired, 411, 'length-required', args);
}
inheritsFrom(LengthRequired, VError);
LengthRequired.prototype.name = 'LengthRequired';

// 422 - Unprocessable
function Unprocessable(...args) {
  return extendVError(this, Unprocessable, 422, 'unprocessable', args);
}
inheritsFrom(Unprocessable, VError);
Unprocessable.prototype.name = 'Unprocessable';

// 429 - Too Many Requests
function TooManyRequests(...args) {
  return extendVError(this, TooManyRequests, 429, 'too-many-requests', args);
}
inheritsFrom(TooManyRequests, VError);
TooManyRequests.prototype.name = 'TooManyRequests';

// 500 - General Error
function GeneralError(...args) {
  return extendVError(this, GeneralError, 500, 'general-error', args);
}
inheritsFrom(GeneralError, VError);
GeneralError.prototype.name = 'GeneralError';

// 501 - Not Implemented
function NotImplemented(...args) {
  return extendVError(this, NotImplemented, 501, 'not-implemented', args);
}
inheritsFrom(NotImplemented, VError);
NotImplemented.prototype.name = 'NotImplemented';

// 502 - Bad Gateway
function BadGateway(...args) {
  return extendVError(this, BadGateway, 502, 'bad-gateway', args);
}
inheritsFrom(BadGateway, VError);
BadGateway.prototype.name = 'BadGateway';

// 503 - Unavailable
function Unavailable(...args) {
  return extendVError(this, Unavailable, 503, 'unavailable', args);
}
inheritsFrom(Unavailable, VError);
Unavailable.prototype.name = 'Unavailable';

export {
  VError,
  BadRequest,
  NotAuthenticated,
  PaymentError,
  Forbidden,
  NotFound,
  MethodNotAllowed,
  NotAcceptable,
  Timeout,
  Conflict,
  Gone,
  LengthRequired,
  Unprocessable,
  TooManyRequests,
  GeneralError,
  NotImplemented,
  BadGateway,
  Unavailable
};
