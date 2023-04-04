/*
 * tst.meta.js: tests the way metarmational properties are inherited with nested
 * errors.
 */

const VError = require('../lib');
const { META } = VError;

describe('meta', () => {
  it('base case using "options" to specify cause', () => {
    const err1 = new Error('bad');
    const err2 = new VError({
      cause: err1
    }, 'worse');

    expect(VError.cause(err2)).toBe(err1);
    expect(err2.message).toBe('worse: bad');
    expect(VError.meta(err2)).toEqual({});
    expect(err2[META]).toEqual({});
  });

  it('simple meta usage', () => {
    const meta = {
      errno: 'EDEADLK',
      anObject: { hello: 'world' }
    };
    const err1 = new VError({
      name: 'MyError',
      meta
    }, 'bad');

    expect(err1.name).toBe('MyError');
    expect(VError.meta(err1)).toEqual(meta);
    expect(err1[META]).toEqual(meta);
  });

  it('simple property propagation using old syntax', () => {
    const meta = {
      errno: 'EDEADLK',
      anObject: { hello: 'world' }
    };
    const err1 = new VError({
      name: 'MyError',
      meta
    }, 'bad');
    const err2 = new VError(err1, 'worse');

    expect(VError.cause(err2)).toBe(err1);
    expect(err2.message).toBe('worse: bad');
    expect(VError.meta(err2)).toEqual(meta);
  });

  it('one property override', () => {
    const meta = {
      errno: 'EDEADLK',
      anObject: { hello: 'world' }
    };
    const err1 = new VError({
      name: 'MyError',
      meta
    }, 'bad');
    const err2 = new VError({
      cause: err1,
      meta: {
        anObject: { hello: 'moon' }
      }
    }, 'worse');

    const expected = {
      errno: 'EDEADLK',
      anObject: { hello: 'moon' }
    };

    expect(VError.cause(err2)).toEqual(err1);
    expect(err2.message).toEqual('worse: bad');
    expect(VError.meta(err2)).toEqual(expected);
    expect(err2[META]).toEqual(expected);
  });

  it('add a third-level to the chain', () => {
    const meta = {
      errno: 'EDEADLK',
      anObject: { hello: 'world' }
    };
    const err1 = new VError({
      name: 'MyError',
      meta
    }, 'bad');
    const err2 = new VError({
      cause: err1,
      meta: {
        anObject: { hello: 'moon' }
      }
    }, 'worse');
    const err3 = new VError({
      cause: err2,
      name: 'BigError',
      meta: {
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
    expect(VError.meta(err3)).toEqual(expected);
    expect(err3[META]).toEqual(expected);
  });
});
