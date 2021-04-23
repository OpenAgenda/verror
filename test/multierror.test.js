/*
 * tst.multierror.js: tests MultiError class
 */

const { VError, MultiError, errorFromList, errorForEach } = require('../lib');
const common = require('./utils');

describe('MultiError', () => {
  const err1 = new Error('error one');
  const err2 = new Error('error two');
  const err3 = new Error('error three');

  it('throws with bad argument', () => {
    expect(() => console.error(new MultiError())).toThrow();
    expect(() => console.error(new MultiError([]))).toThrow();
  });

  it('simple MultiError', () => {
    const merr = new MultiError([err1, err2, err3]);
    const nodestack = common.getNodeStack();

    expect(VError.cause(merr)).toBe(err1);
    expect(merr.message).toBe('first of 3 errors: error one');
    expect(merr.name).toBe('MultiError');

    const stack = common.cleanStack(merr.stack);

    expect(stack).toBe([
      'MultiError: first of 3 errors: error one',
      '    at Object.<anonymous> (dummy filename)',
      nodestack
    ].join('\n'));
  });

  it('MultiError with only one Error', () => {
    const merr = new MultiError([err1]);
    const nodestack = common.getNodeStack();

    expect(merr.message).toBe('first of 1 error: error one');
    expect(merr.name).toBe('MultiError');

    const stack = common.cleanStack(merr.stack);

    expect(stack).toBe([
      'MultiError: first of 1 error: error one',
      '    at Object.<anonymous> (dummy filename)',
      nodestack
    ].join('\n'));
  });

  it('errorFromList', () => {
    expect(() => console.error(errorFromList())).toThrow();
    expect(() => console.error(errorFromList(null))).toThrow();
    expect(() => console.error(errorFromList({}))).toThrow();
    expect(() => console.error(errorFromList('asdf'))).toThrow();
    expect(() => console.error(errorFromList([new Error(), 17]))).toThrow();
    expect(() => console.error(errorFromList([new Error(), {}]))).toThrow();
    expect(errorFromList([])).toBeNull();
    expect(errorFromList([err1])).toBe(err1);

    const merr = errorFromList([err1, err2, err3]);

    expect(merr).toBeInstanceOf(MultiError);
    expect(merr.errors).toEqual([err1, err2, err3]);
  });

  it('errorForEach', () => {
    expect(() => console.error(errorForEach())).toThrow();
    expect(() => console.error(errorForEach(null))).toThrow();
    expect(() => console.error(errorForEach(err1))).toThrow();
    expect(() => console.error(errorForEach(err1, {}))).toThrow();
    expect(() => console.error(errorForEach([new Error(), 17]))).toThrow();
    expect(() => console.error(errorForEach({}, () => {}))).toThrow();

    const accum = [];
    errorForEach(err1, e => accum.push(e));

    expect(accum).toEqual([err1]);

    const accum2 = [];
    const merr = errorFromList([err1, err2, err3]);
    errorForEach(merr, e => accum2.push(e));

    expect(accum2).toEqual([err1, err2, err3]);

    expect(merr.toJSON()).toEqual({
      name: 'MultiError',
      message: 'first of 3 errors: error one',
      shortMessage: 'first of 3 errors',
      cause: err1,
      info: {},
      errors: [err1, err2, err3]
    });
  });
});
