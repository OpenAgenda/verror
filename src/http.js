import parseConstructorArguments from './parseConstructorArguments';
import VError from './verror';
import inheritsFrom from './inheritsFrom';
import getInstance from './getInstance';

// TODO decorate - an option with extra properties to set on the error object.

function extendVError(_this, ctor, name, code, className, args) {
  const that = getInstance(_this, ctor, args);

  const { options, shortmessage } = parseConstructorArguments(...args);
  const decorate = {
    code,
    className
  };

  if (options.decorate) {
    // TODO should be an object

    Object.assign(decorate, options.decorate);
  }

  VError.call(that, {
    constructorOpt: ctor,
    name,
    code,
    className,
    ...options,
    decorate
  }, shortmessage);

  return that;
}

// 400 - Bad Request
function BadRequest(...args) {
  return extendVError(this, BadRequest, 'BadRequest', 400, 'bad-request', args);
}
inheritsFrom(BadRequest, VError);

// 401 - Not Authenticated
function NotAuthenticated(...args) {
  return extendVError(this, NotAuthenticated, 'NotAuthenticated', 401, 'not-authenticated', args);
}
inheritsFrom(NotAuthenticated, VError);

// 402 - Payment Error
function PaymentError(...args) {
  return extendVError(this, PaymentError, 'PaymentError', 402, 'payment-error', args);
}
inheritsFrom(PaymentError, VError);

// 403 - Forbidden
function Forbidden(...args) {
  return extendVError(this, Forbidden, 'Forbidden', 403, 'forbidden', args);
}
inheritsFrom(Forbidden, VError);

// 404 - Not Found
function NotFound(...args) {
  return extendVError(this, NotFound, 'NotFound', 404, 'not-found', args);
}
inheritsFrom(NotFound, VError);

// 405 - Method Not Allowed
function MethodNotAllowed(...args) {
  return extendVError(this, MethodNotAllowed, 'MethodNotAllowed', 405, 'method-not-allowed', args);
}
inheritsFrom(MethodNotAllowed, VError);

// 406 - Not Acceptable
function NotAcceptable(...args) {
  return extendVError(this, NotAcceptable, 'NotAcceptable', 406, 'not-acceptable', args);
}
inheritsFrom(NotAcceptable, VError);

// 408 - Timeout
function Timeout(...args) {
  return extendVError(this, Timeout, 'Timeout', 408, 'timeout', args);
}
inheritsFrom(Timeout, VError);

// 409 - Conflict
function Conflict(...args) {
  return extendVError(this, Conflict, 'Conflict', 409, 'conflict', args);
}
inheritsFrom(Conflict, VError);

// 410 - Gone
function Gone(...args) {
  return extendVError(this, Gone, 'Gone', 410, 'gone', args);
}
inheritsFrom(Gone, VError);

// 411 - Length Required
function LengthRequired(...args) {
  return extendVError(this, LengthRequired, 'LengthRequired', 411, 'length-required', args);
}
inheritsFrom(LengthRequired, VError);

// 422 - Unprocessable
function Unprocessable(...args) {
  return extendVError(this, Unprocessable, 'Unprocessable', 422, 'unprocessable', args);
}
inheritsFrom(Unprocessable, VError);

// 429 - Too Many Requests
function TooManyRequests(...args) {
  return extendVError(this, TooManyRequests, 'TooManyRequests', 429, 'too-many-requests', args);
}
inheritsFrom(TooManyRequests, VError);

// 500 - General Error
function GeneralError(...args) {
  return extendVError(this, GeneralError, 'GeneralError', 500, 'general-error', args);
}
inheritsFrom(GeneralError, VError);

// 501 - Not Implemented
function NotImplemented(...args) {
  return extendVError(this, NotImplemented, 'NotImplemented', 501, 'not-implemented', args);
}
inheritsFrom(NotImplemented, VError);

// 502 - Bad Gateway
function BadGateway(...args) {
  return extendVError(this, BadGateway, 'BadGateway', 502, 'bad-gateway', args);
}
inheritsFrom(BadGateway, VError);

// 503 - Unavailable
function Unavailable(...args) {
  return extendVError(this, Unavailable, 'Unavailable', 503, 'unavailable', args);
}
inheritsFrom(Unavailable, VError);

export {
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
