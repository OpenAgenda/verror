'use strict';

/*
 * tst.common.js: tests functionality that's common to the VError and WError classes.
 */

const { VError, WError } = require('../lib');
const common = require('./utils');

/*
   * Runs all tests using the class "cons".  We'll apply this to each of the main
   * classes.
   */
function runTests(Cons, label) {
  /*
   * On Node v0.10 and earlier, the name that's used in the "stack" output
   * is the constructor that was used for this object.  On Node v0.12 and
   * later, it's the value of the "name" property on the Error when it was
   * constructed.
   */
  const stackname = common.oldNode() ? Cons.name : label;

  function makeErr(options) {
    return (new Cons(options, 'test error'));
  }

  describe(label, () => {
    it('no arguments', () => {
      const err = new Cons();
      const nodestack = common.getNodeStack();

      expect(err.name).toBe(label);
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(Cons);
      expect(err.message).toBe('');
      expect(VError.cause(err)).toBeNull();

      const stack = common.cleanStack(err.stack);

      expect(stack).toBe([
        `${stackname}: `,
        '    at Object.<anonymous> (dummy filename)',
        nodestack
      ].join('\n'));
    });

    it('options-argument form', () => {
      const err = new Cons({});

      expect(err.name).toBe(label);
      expect(err.message).toBe('');
      expect(VError.cause(err)).toBeNull();
    });

    it('simple message', () => {
      const err = new Cons('my error');
      const nodestack = common.getNodeStack();

      expect(err.name).toBe(label);
      expect(err.message).toBe('my error');
      expect(VError.cause(err)).toBeNull();

      const stack = common.cleanStack(err.stack);

      expect(stack).toBe([
        `${stackname}: my error`,
        '    at Object.<anonymous> (dummy filename)',
        nodestack
      ].join('\n'));
    });

    it('simple message as second parameter', () => {
      const err = new Cons({}, 'my error');

      expect(err.name).toBe(label);
      expect(err.message).toBe('my error');
      expect(VError.cause(err)).toBeNull();
    });

    it('fullStack', () => {
      const err = new Cons('Some error');
      const stack = common.cleanStack(VError.fullStack(err));
      const nodestack = common.getNodeStack();

      expect(stack).toBe([
        `${stackname}: Some error`,
        '    at Object.<anonymous> (dummy filename)',
        nodestack
      ].join('\n'));
    });

    it('printf-style message', () => {
      const err = new Cons('%s error: %3d problems', 'very bad', 15);

      expect(err.message).toBe('very bad error:  15 problems');
      expect(VError.cause(err)).toBeNull();
    });

    it('printf-style message as second parameter', () => {
      const err = new Cons({}, '%s error: %3d problems', 'very bad', 15);

      expect(err.message).toBe('very bad error:  15 problems');
      expect(VError.cause(err)).toBeNull();
    });

    it('null cause (for backwards compatibility with older versions)', () => {
      const err = new Cons(null, 'my error');
      const nodestack = common.getNodeStack();

      expect(err.message).toBe('my error');
      expect(VError.cause(err)).toBeNull();

      const stack = common.cleanStack(err.stack);

      expect(stack).toBe([
        `${stackname}: my error`,
        '    at Object.<anonymous> (dummy filename)',
        nodestack
      ].join('\n'));
    });

    it('null cause in option-argument (for backwards compatibility with older versions)', () => {
      const err = new Cons({ cause: null }, 'my error');

      expect(err.message).toBe('my error');
      expect(VError.cause(err)).toBeNull();
    });

    it('null cause without message (for backwards compatibility with older versions)', () => {
      const err = new Cons(null);
      const nodestack = common.getNodeStack();

      expect(err.message).toBe('');
      expect(VError.cause(err)).toBeNull();

      const stack = common.cleanStack(err.stack);

      expect(stack).toBe([
        `${stackname}: `,
        '    at Object.<anonymous> (dummy filename)',
        nodestack
      ].join('\n'));
    });

    it('without constructorOpt option', () => {
      const err = makeErr({});
      const stack = common.cleanStack(err.stack);
      const nodestack = common.getNodeStack();

      expect(stack).toBe([
        `${stackname}: test error`,
        '    at makeErr (dummy filename)',
        '    at Object.<anonymous> (dummy filename)',
        nodestack
      ].join('\n'));
    });

    it('with constructorOpt option', () => {
      const err = makeErr({ constructorOpt: makeErr });
      const stack = common.cleanStack(err.stack);
      const nodestack = common.getNodeStack();

      expect(stack).toBe([
        `${stackname}: test error`,
        '    at Object.<anonymous> (dummy filename)',
        nodestack
      ].join('\n'));
    });

    describe('invoked without "new"', () => {
      const err = Cons('my %s string', 'testing!');

      expect(err.name).toBe(label);
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(Cons);
      expect(err.message).toBe('my testing! string');
    });

    describe('custom "name"', () => {
      const err = new Cons({ name: 'SomeOtherError' }, 'another kind of error');
      const nodestack = common.getNodeStack();

      expect(err.name).toBe('SomeOtherError');
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(Cons);
      expect(err.message).toBe('another kind of error');

      const stack = common.cleanStack(err.stack);

      expect(stack).toBe([
        'SomeOtherError: another kind of error',
        '    at Suite.<anonymous> (dummy filename)',
        nodestack
      ].join('\n'));
    });
  });
}

describe('common', () => {
  Error.stackTraceLimit = 25;

  runTests(VError, 'VError');
  runTests(WError, 'WError');

  it('fullStack works with an Error', () => {
    const err = new Error('Some error');
    const stack = common.cleanStack(VError.fullStack(err));
    const nodestack = common.getNodeStack();

    expect(stack).toBe([
      'Error: Some error',
      '    at Object.<anonymous> (dummy filename)',
      nodestack
    ].join('\n'));
  });
});
