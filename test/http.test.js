const VError = require('..');

describe('http', () => {
  describe('error types', () => {
    expect(typeof VError.BadRequest).toBe('function');
    expect(typeof VError.NotAuthenticated).toBe('function');
    expect(typeof VError.PaymentError).toBe('function');
    expect(typeof VError.Forbidden).toBe('function');
    expect(typeof VError.NotFound).toBe('function');
    expect(typeof VError.MethodNotAllowed).toBe('function');
    expect(typeof VError.NotAcceptable).toBe('function');
    expect(typeof VError.Timeout).toBe('function');
    expect(typeof VError.Conflict).toBe('function');
    expect(typeof VError.Gone).toBe('function');
    expect(typeof VError.LengthRequired).toBe('function');
    expect(typeof VError.Unprocessable).toBe('function');
    expect(typeof VError.TooManyRequests).toBe('function');
    expect(typeof VError.GeneralError).toBe('function');
    expect(typeof VError.NotImplemented).toBe('function');
    expect(typeof VError.BadGateway).toBe('function');
    expect(typeof VError.Unavailable).toBe('function');
    expect(typeof VError[400]).toBe('function');
    expect(typeof VError[401]).toBe('function');
    expect(typeof VError[402]).toBe('function');
    expect(typeof VError[403]).toBe('function');
    expect(typeof VError[404]).toBe('function');
    expect(typeof VError[405]).toBe('function');
    expect(typeof VError[406]).toBe('function');
    expect(typeof VError[408]).toBe('function');
    expect(typeof VError[409]).toBe('function');
    expect(typeof VError[410]).toBe('function');
    expect(typeof VError[411]).toBe('function');
    expect(typeof VError[422]).toBe('function');
    expect(typeof VError[429]).toBe('function');
    expect(typeof VError[500]).toBe('function');
    expect(typeof VError[501]).toBe('function');
    expect(typeof VError[502]).toBe('function');
    expect(typeof VError[503]).toBe('function');
  });

  it('simple http error', () => {
    const err = new VError.BadRequest('something went wrong');

    expect(err.statusCode).toBe(400);
    expect(err.className).toBe('bad-request');
    expect(err.toJSON()).toStrictEqual({
      name: 'BadRequest',
      message: 'something went wrong',
      shortMessage: 'something went wrong',
      cause: undefined,
      info: {},
      code: 400,
      statusCode: 400,
      className: 'bad-request'
    });
  });

  it('extend and override meta option', () => {
    const err = new VError.BadRequest({
      meta: {
        other: 42,
        className: 'very-bad-request'
      }
    }, 'something went wrong');

    expect(err.statusCode).toBe(400);
    expect(err.className).toBe('very-bad-request');
    expect(err.other).toBe(42);
    expect(err.toJSON()).toStrictEqual({
      name: 'BadRequest',
      message: 'something went wrong',
      shortMessage: 'something went wrong',
      cause: undefined,
      info: {},
      code: 400,
      statusCode: 400,
      className: 'very-bad-request',
      other: 42
    });
  });

  it('can not extends native properties', () => {
    expect(() => new VError.BadRequest({
      meta: {
        name: 42,
        cause: 'a cause',
        info: null,
        stack: 'lol'
      }
    }, 'something went wrong')).toThrow();
  });

  it('throw with a bad meta option', () => {
    expect(() => new VError.BadRequest({
      meta: 'no'
    })).toThrow();
  });

  it('wrapped http error conserve meta of cause', () => {
    const err = new VError.BadRequest('something went wrong');
    const werr = new VError(err);

    expect(werr.statusCode).toBe(400);
    expect(werr.className).toBe('bad-request');
  });

  it('HTTPError exists and inheritance hierarchy is correct', () => {
    // HTTPError should exist and be a function
    expect(typeof VError.HTTPError).toBe('function');

    // Create instances
    const httpErr = new VError.HTTPError('generic http error');
    const badRequestErr = new VError.BadRequest('bad request');
    const notFoundErr = new VError.NotFound('not found');

    // HTTPError should extend VError
    expect(httpErr instanceof VError.HTTPError).toBe(true);
    expect(httpErr instanceof VError.VError).toBe(true);
    expect(httpErr instanceof Error).toBe(true);

    // Specific HTTP errors should extend HTTPError
    expect(badRequestErr instanceof VError.BadRequest).toBe(true);
    expect(badRequestErr instanceof VError.HTTPError).toBe(true);
    expect(badRequestErr instanceof VError.VError).toBe(true);
    expect(badRequestErr instanceof Error).toBe(true);

    expect(notFoundErr instanceof VError.NotFound).toBe(true);
    expect(notFoundErr instanceof VError.HTTPError).toBe(true);
    expect(notFoundErr instanceof VError.VError).toBe(true);
    expect(notFoundErr instanceof Error).toBe(true);

    // Check names
    expect(httpErr.name).toBe('HTTPError');
    expect(badRequestErr.name).toBe('BadRequest');
    expect(notFoundErr.name).toBe('NotFound');
  });
});
