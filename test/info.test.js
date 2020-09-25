/*
 * tst.info.js: tests the way informational properties are inherited with nested
 * errors.
 */

const VError = require('../lib/verror');

describe('info', () => {
  describe('base case using "options" to specify cause', () => {
    const err1 = new Error('bad');
    const err2 = new VError({
      cause: err1
    }, 'worse');

    it('has good cause', () => {
      expect(VError.cause(err2)).toBe(err1);
    });

    it('has good message', () => {
      expect(err2.message).toBe('worse: bad');
    });

    it('has good info', () => {
      expect(VError.info(err2)).toEqual({});
    });
  });

  describe('simple info usage', () => {
    const info = {
      errno: 'EDEADLK',
      anobject: { hello: 'world' }
    };
    const err1 = new VError({
      name: 'MyError',
      info
    }, 'bad');

    it('has good name', () => {
      expect(err1.name).toBe('MyError');
    });

    it('has good info', () => {
      expect(VError.info(err1)).toEqual(info);
    });
  });

  describe('simple property propagation using old syntax', () => {
    const info = {
      errno: 'EDEADLK',
      anobject: { hello: 'world' }
    };
    const err1 = new VError({
      name: 'MyError',
      info
    }, 'bad');
    const err2 = new VError(err1, 'worse');

    it('has good cause', () => {
      expect(VError.cause(err2)).toBe(err1);
    });

    it('has good message', () => {
      expect(err2.message).toBe('worse: bad');
    });

    it('has good info', () => {
      expect(VError.info(err2)).toEqual(info);
    });
  });

  describe('one property override', () => {
    const info = {
      errno: 'EDEADLK',
      anobject: { hello: 'world' }
    };
    const err1 = new VError({
      name: 'MyError',
      info
    }, 'bad');
    const err2 = new VError({
      cause: err1,
      info: {
        anobject: { hello: 'moon' }
      }
    }, 'worse');

    it('has good cause', () => {
      expect(VError.cause(err2)).toEqual(err1);
    });

    it('has good message', () => {
      expect(err2.message).toEqual('worse: bad');
    });

    it('has good info', () => {
      expect(VError.info(err2)).toEqual({
        errno: 'EDEADLK',
        anobject: { hello: 'moon' }
      });
    });
  });

  describe('add a third-level to the chain', () => {
    const info = {
      errno: 'EDEADLK',
      anobject: { hello: 'world' }
    };
    const err1 = new VError({
      name: 'MyError',
      info
    }, 'bad');
    const err2 = new VError({
      cause: err1,
      info: {
        anobject: { hello: 'moon' }
      }
    }, 'worse');
    const err3 = new VError({
      cause: err2,
      name: 'BigError',
      info: {
        remote_ip: '127.0.0.1'
      }
    }, 'what next');

    it('has good name', () => {
      expect(err3.name).toBe('BigError');
    });

    it('has good cause', () => {
      expect(VError.cause(err3)).toBe(err2);
    });

    it('has good message', () => {
      expect(err3.message).toBe('what next: worse: bad');
    });

    it('has good info.remote_ip', () => {
      expect(VError.info(err3).remote_ip).toBe('127.0.0.1');
    });

    it('has good info.errno', () => {
      expect(VError.info(err3).errno).toBe('EDEADLK');
    });

    it('has good info.anobject', () => {
      expect(VError.info(err3).anobject).toEqual({ hello: 'moon' });
    });
  });
});
