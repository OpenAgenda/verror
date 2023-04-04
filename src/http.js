import inherits from 'inherits';
import depd from 'depd';
import parseConstructorArguments from './parseConstructorArguments';
import VError from './verror';

const deprecate = depd('@openangeda/verror');

function createError(name, statusCode, className) {
  const ExtendedError = function (...args) {
    if (!(this instanceof ExtendedError)) {
      return new ExtendedError(...args);
    }

    const { options, shortMessage } = parseConstructorArguments(...args);

    options.meta = {
      code: statusCode,
      statusCode,
      className,
      ...options.meta
    };

    VError.call(
      this,
      options,
      shortMessage
    );

    deprecate.property(this, 'code', 'use `statusCode` instead of `code`');
  }

  // function.name
  Object.defineProperty(ExtendedError, 'name', { configurable: true, value: name });

  inherits(ExtendedError, VError);
  ExtendedError.prototype.name = name;

  return ExtendedError;
}

const BadRequest = createError('BadRequest', 400, 'bad-request');
const NotAuthenticated = createError('NotAuthenticated', 401, 'not-authenticated');
const PaymentError = createError('PaymentError', 402, 'payment-error');
const Forbidden = createError('Forbidden', 403, 'forbidden');
const NotFound = createError('NotFound', 404, 'not-found');
const MethodNotAllowed = createError('MethodNotAllowed', 405, 'method-not-allowed');
const NotAcceptable = createError('NotAcceptable', 406, 'not-acceptable');
const Timeout = createError('Timeout', 408, 'timeout');
const Conflict = createError('Conflict', 409, 'conflict');
const Gone = createError('Gone', 410, 'gone');
const LengthRequired = createError('LengthRequired', 411, 'length-required');
const Unprocessable = createError('Unprocessable', 422, 'unprocessable');
const TooManyRequests = createError('TooManyRequests', 429, 'too-many-requests');
const GeneralError = createError('GeneralError', 500, 'general-error');
const NotImplemented = createError('NotImplemented', 501, 'not-implemented');
const BadGateway = createError('BadGateway', 502, 'bad-gateway');
const Unavailable = createError('Unavailable', 503, 'unavailable');

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
  Unavailable,
};
