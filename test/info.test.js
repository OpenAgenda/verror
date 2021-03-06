/*
 * tst.info.js: tests the way informational properties are inherited with nested
 * errors.
 */

const VError = require('../lib');

describe('info', () => {
  it('base case using "options" to specify cause', () => {
    const err1 = new Error('bad');
    const err2 = new VError({
      cause: err1
    }, 'worse');

    expect(VError.cause(err2)).toBe(err1);
    expect(err2.message).toBe('worse: bad');
    expect(VError.info(err2)).toEqual({});
  });

  it('simple info usage', () => {
    const info = {
      errno: 'EDEADLK',
      anObject: { hello: 'world' }
    };
    const err1 = new VError({
      name: 'MyError',
      info
    }, 'bad');

    expect(err1.name).toBe('MyError');
    expect(VError.info(err1)).toEqual(info);
  });

  it('simple property propagation using old syntax', () => {
    const info = {
      errno: 'EDEADLK',
      anObject: { hello: 'world' }
    };
    const err1 = new VError({
      name: 'MyError',
      info
    }, 'bad');
    const err2 = new VError(err1, 'worse');

    expect(VError.cause(err2)).toBe(err1);
    expect(err2.message).toBe('worse: bad');
    expect(VError.info(err2)).toEqual(info);
  });

  it('one property override', () => {
    const info = {
      errno: 'EDEADLK',
      anObject: { hello: 'world' }
    };
    const err1 = new VError({
      name: 'MyError',
      info
    }, 'bad');
    const err2 = new VError({
      cause: err1,
      info: {
        anObject: { hello: 'moon' }
      }
    }, 'worse');

    const expected = {
      errno: 'EDEADLK',
      anObject: { hello: 'moon' }
    };

    expect(VError.cause(err2)).toEqual(err1);
    expect(err2.message).toEqual('worse: bad');
    expect(VError.info(err2)).toEqual(expected);
  });

  it('add a third-level to the chain', () => {
    const info = {
      errno: 'EDEADLK',
      anObject: { hello: 'world' }
    };
    const err1 = new VError({
      name: 'MyError',
      info
    }, 'bad');
    const err2 = new VError({
      cause: err1,
      info: {
        anObject: { hello: 'moon' }
      }
    }, 'worse');
    const err3 = new VError({
      cause: err2,
      name: 'BigError',
      info: {
        remoteIp: '127.0.0.1'
      }
    }, 'what next');

    const expected = {
      remoteIp: '127.0.0.1',
      errno: 'EDEADLK',
      anObject: { hello: 'moon' }
    };

    expect(err3.name).toBe('BigError');
    expect(VError.cause(err3)).toBe(err2);
    expect(err3.message).toBe('what next: worse: bad');
    expect(VError.info(err3)).toEqual(expected);
  });
});
