import VError from './verror';
import * as httpErrors from './http';

const httpAliases = {
  400: httpErrors.BadRequest,
  401: httpErrors.NotAuthenticated,
  402: httpErrors.PaymentError,
  403: httpErrors.Forbidden,
  404: httpErrors.NotFound,
  405: httpErrors.MethodNotAllowed,
  406: httpErrors.NotAcceptable,
  408: httpErrors.Timeout,
  409: httpErrors.Conflict,
  410: httpErrors.Gone,
  411: httpErrors.LengthRequired,
  422: httpErrors.Unprocessable,
  429: httpErrors.TooManyRequests,
  500: httpErrors.GeneralError,
  501: httpErrors.NotImplemented,
  502: httpErrors.BadGateway,
  503: httpErrors.Unavailable
};

Object.assign(VError, httpErrors, httpAliases);

export default VError;
