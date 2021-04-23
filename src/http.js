import parseConstructorArguments from './parseConstructorArguments';
import VError from './verror';
import { inheritsFrom, getInstance } from './utils';

function getArgs(code, className, args) {
  const { options, shortmessage } = parseConstructorArguments(...args);
  const decorate = {
    code,
    className
  };

  if (options.decorate) {
    Object.assign(decorate, options.decorate);
  }

  return [
    {
      ...options,
      decorate
    },
    shortmessage
  ];
}

function HttpError(...args) {
  return VError.apply(
    getInstance(this, HttpError, args),
    getArgs(400, 'bad-request', args)
  );
}
inheritsFrom(HttpError, VError);
HttpError.prototype.name = 'HttpError';

function extendHttpError(that, ctor, code, className, args) {
  return HttpError.apply(
    getInstance(that, ctor, args),
    getArgs(code, className, args)
  );
}

// 400 - Bad Request
function BadRequest(...args) {
  return extendHttpError(this, BadRequest, 400, 'bad-request', args);
}
inheritsFrom(BadRequest, HttpError);
BadRequest.prototype.name = 'BadRequest';

// 401 - Not Authenticated
function NotAuthenticated(...args) {
  return extendHttpError(this, NotAuthenticated, 401, 'not-authenticated', args);
}
inheritsFrom(NotAuthenticated, HttpError);
NotAuthenticated.prototype.name = 'NotAuthenticated';

// 402 - Payment Error
function PaymentError(...args) {
  return extendHttpError(this, PaymentError, 402, 'payment-error', args);
}
inheritsFrom(PaymentError, HttpError);
PaymentError.prototype.name = 'PaymentError';

// 403 - Forbidden
function Forbidden(...args) {
  return extendHttpError(this, Forbidden, 403, 'forbidden', args);
}
inheritsFrom(Forbidden, HttpError);
Forbidden.prototype.name = 'Forbidden';

// 404 - Not Found
function NotFound(...args) {
  return extendHttpError(this, NotFound, 404, 'not-found', args);
}
inheritsFrom(NotFound, HttpError);
NotFound.prototype.name = 'NotFound';

// 405 - Method Not Allowed
function MethodNotAllowed(...args) {
  return extendHttpError(this, MethodNotAllowed, 405, 'method-not-allowed', args);
}
inheritsFrom(MethodNotAllowed, HttpError);
MethodNotAllowed.prototype.name = 'MethodNotAllowed';

// 406 - Not Acceptable
function NotAcceptable(...args) {
  return extendHttpError(this, NotAcceptable, 406, 'not-acceptable', args);
}
inheritsFrom(NotAcceptable, HttpError);
NotAcceptable.prototype.name = 'NotAcceptable';

// 408 - Timeout
function Timeout(...args) {
  return extendHttpError(this, Timeout, 408, 'timeout', args);
}
inheritsFrom(Timeout, HttpError);
Timeout.prototype.name = 'Timeout';

// 409 - Conflict
function Conflict(...args) {
  return extendHttpError(this, Conflict, 409, 'conflict', args);
}
inheritsFrom(Conflict, HttpError);
Conflict.prototype.name = 'Conflict';

// 410 - Gone
function Gone(...args) {
  return extendHttpError(this, Gone, 410, 'gone', args);
}
inheritsFrom(Gone, HttpError);
Gone.prototype.name = 'Gone';

// 411 - Length Required
function LengthRequired(...args) {
  return extendHttpError(this, LengthRequired, 411, 'length-required', args);
}
inheritsFrom(LengthRequired, HttpError);
LengthRequired.prototype.name = 'LengthRequired';

// 422 - Unprocessable
function Unprocessable(...args) {
  return extendHttpError(this, Unprocessable, 422, 'unprocessable', args);
}
inheritsFrom(Unprocessable, HttpError);
Unprocessable.prototype.name = 'Unprocessable';

// 429 - Too Many Requests
function TooManyRequests(...args) {
  return extendHttpError(this, TooManyRequests, 429, 'too-many-requests', args);
}
inheritsFrom(TooManyRequests, HttpError);
TooManyRequests.prototype.name = 'TooManyRequests';

// 500 - General Error
function GeneralError(...args) {
  return extendHttpError(this, GeneralError, 500, 'general-error', args);
}
inheritsFrom(GeneralError, HttpError);
GeneralError.prototype.name = 'GeneralError';

// 501 - Not Implemented
function NotImplemented(...args) {
  return extendHttpError(this, NotImplemented, 501, 'not-implemented', args);
}
inheritsFrom(NotImplemented, HttpError);
NotImplemented.prototype.name = 'NotImplemented';

// 502 - Bad Gateway
function BadGateway(...args) {
  return extendHttpError(this, BadGateway, 502, 'bad-gateway', args);
}
inheritsFrom(BadGateway, HttpError);
BadGateway.prototype.name = 'BadGateway';

// 503 - Unavailable
function Unavailable(...args) {
  return extendHttpError(this, Unavailable, 503, 'unavailable', args);
}
inheritsFrom(Unavailable, HttpError);
Unavailable.prototype.name = 'Unavailable';

export {
  HttpError,
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
