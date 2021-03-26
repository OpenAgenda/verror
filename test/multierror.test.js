/*
 * tst.multierror.js: tests MultiError class
 */

const { VError, MultiError, errorFromList, errorForEach } = require('../lib');
const common = require('./utils');

describe('MultiError', () => {
  const err1 = new Error('error one');
  const err2 = new Error('error two');
  const err3 = new Error('error three');

  it('throws without argument', () => {
    expect(() => console.error(new MultiError())).toThrow();
  });

  it('throws with empty list', () => {
    expect(() => console.error(new MultiError([]))).toThrow();
  });

  describe('simple MultiError', () => {
    const merr = new MultiError([err1, err2, err3]);
    const nodestack = common.getNodeStack();

    it('has good cause', () => {
      expect(VError.cause(merr)).toBe(err1);
    });

    it('has good message', () => {
      expect(merr.message).toBe('first of 3 errors: error one');
    });

    it('has good name', () => {
      expect(merr.name).toBe('MultiError');
    });

    it('has good stack', () => {
      const stack = common.cleanStack(merr.stack);
      const adjustedStack = stack.split('\n').slice(0, -1).join('\n');

      expect(adjustedStack).toBe([
        'MultiError: first of 3 errors: error one',
        '    at Suite.<anonymous> (dummy filename)'
      ].join('\n') + '\n' + nodestack);
    });
  });

  describe('MultiError with only one Error', () => {
    const merr = new MultiError([err1]);
    const nodestack = common.getNodeStack();

    it('has good message', () => {
      expect(merr.message).toBe('first of 1 error: error one');
    });

    it('has good name', () => {
      expect(merr.name).toBe('MultiError');
    });

    it('has good stack', () => {
      const stack = common.cleanStack(merr.stack);
      const adjustedStack = stack.split('\n').slice(0, -1).join('\n');

      expect(adjustedStack).toBe([
        'MultiError: first of 1 error: error one',
        '    at Suite.<anonymous> (dummy filename)'
      ].join('\n') + '\n' + nodestack);
    });
  });

  describe('errorFromList', () => {
    it('throws whitout argument', () => {
      expect(() => console.error(errorFromList())).toThrow();
    });

    it('throws with null', () => {
      expect(() => console.error(errorFromList(null))).toThrow();
    });

    it('throws with an object', () => {
      expect(() => console.error(errorFromList({}))).toThrow();
    });

    it('throws with string', () => {
      expect(() => console.error(errorFromList('asdf'))).toThrow();
    });

    it('throws with an error and a number', () => {
      expect(() => console.error(errorFromList([new Error(), 17]))).toThrow();
    });

    it('throws with an error and an object', () => {
      expect(() => console.error(errorFromList([new Error(), {}]))).toThrow();
    });

    it('is null with an empty array', () => {
      expect(errorFromList([])).toBeNull();
    });

    it('works with one error', () => {
      expect(errorFromList([err1])).toBe(err1);
    });

    it('works with multiple errors', () => {
      const merr = errorFromList([err1, err2, err3]);

      expect(merr).toBeInstanceOf(MultiError);
      expect(merr.errors()).toEqual([err1, err2, err3]);
    });
  });

  describe('errorForEach', () => {
    it('throws whitout argument', () => {
      expect(() => console.error(errorForEach())).toThrow();
    });

    it('throws with null', () => {
      expect(() => console.error(errorForEach(null))).toThrow();
    });

    it('throws with an error', () => {
      expect(() => console.error(errorForEach(err1))).toThrow();
    });

    it('throws with an error and an object', () => {
      expect(() => console.error(errorForEach(err1, {}))).toThrow();
    });

    it('throws with an error and a number', () => {
      expect(() => console.error(errorForEach([new Error(), 17]))).toThrow();
    });

    it('throws with an error and a function', () => {
      expect(() => console.error(errorForEach({}, () => {}))).toThrow();
    });

    it('works with an Error', () => {
      const accum = [];
      errorForEach(err1, e => accum.push(e));

      expect(accum.length).toBe(1);
      expect(accum[0]).toBe(err1);
    });

    it('works with multiple errors', () => {
      const accum = [];
      const merr = errorFromList([err1, err2, err3]);
      errorForEach(merr, e => accum.push(e));

      expect(accum.length).toBe(3);
      expect(accum[0]).toBe(err1);
      expect(accum[1]).toBe(err2);
      expect(accum[2]).toBe(err3);
    });
  });
});
