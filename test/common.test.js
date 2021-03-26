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

  describe(label, () => {
    describe('no arguments', () => {
      const err = new Cons();
      const nodestack = common.getNodeStack();

      it('has a good name', () => {
        expect(err.name).toBe(label);
      });

      it('is an instance of Error', () => {
        expect(err).toBeInstanceOf(Error);
      });

      it(`is an instance of ${label}`, () => {
        expect(err).toBeInstanceOf(Cons);
      });

      it('has a good message', () => {
        expect(err.message).toBe('');
      });

      it('has a good cause', () => {
        expect(VError.cause(err)).toBeNull();
      });

      it('has a good stack', () => {
        const stack = common.cleanStack(err.stack);

        expect(stack).toBe(`${[
          `${stackname}: `,
          '    at Suite.<anonymous> (dummy filename)'
        ].join('\n')}\n${nodestack}`);
      });
    });

    describe('options-argument form', () => {
      const err = new Cons({});

      it('has a good name', () => {
        expect(err.name).toBe(label);
      });

      it('has a good message', () => {
        expect(err.message).toBe('');
      });

      it('has a good cause', () => {
        expect(VError.cause(err)).toBeNull();
      });
    });

    describe('simple message', () => {
      const err = new Cons('my error');
      const nodestack = common.getNodeStack();

      it('has a good name', () => {
        expect(err.name).toBe(label);
      });

      it('has a good message', () => {
        expect(err.message).toBe('my error');
      });

      it('has a good cause', () => {
        expect(VError.cause(err)).toBeNull();
      });

      it('has a good stack', () => {
        const stack = common.cleanStack(err.stack);

        expect(stack).toBe(`${[
          `${stackname}: my error`,
          '    at Suite.<anonymous> (dummy filename)'
        ].join('\n')}\n${nodestack}`);
      });
    });

    describe('simple message as second parameter', () => {
      const err = new Cons({}, 'my error');

      it('has a good name', () => {
        expect(err.name).toBe(label);
      });

      it('has a good message', () => {
        expect(err.message).toBe('my error');
      });

      it('has a good cause', () => {
        expect(VError.cause(err)).toBeNull();
      });
    });

    describe('fullStack', () => {
      it(`works with a ${label}`, () => {
        const err = new Cons('Some error');
        const stack = common.cleanStack(VError.fullStack(err));
        const nodestack = common.getNodeStack();

        expect(stack).toBe(`${[
          `${stackname}: Some error`,
          '    at Object.<anonymous> (dummy filename)'
        ].join('\n')}\n${nodestack}`);
      });

      it('works with an Error', () => {
        const err = new Error('Some error');
        const stack = common.cleanStack(VError.fullStack(err));
        const nodestack = common.getNodeStack();

        expect(stack).toBe(`${[
          'Error: Some error',
          '    at Object.<anonymous> (dummy filename)'
        ].join('\n')}\n${nodestack}`);
      });
    });

    describe('printf-style message', () => {
      const err = new Cons('%s error: %3d problems', 'very bad', 15);

      it('has a good message', () => {
        expect(err.message).toBe('very bad error:  15 problems');
      });

      it('has a good cause', () => {
        expect(VError.cause(err)).toBeNull();
      });
    });

    describe('printf-style message as second parameter', () => {
      const err = new Cons({}, '%s error: %3d problems', 'very bad', 15);

      it('has a good message', () => {
        expect(err.message).toBe('very bad error:  15 problems');
      });

      it('has a good cause', () => {
        expect(VError.cause(err)).toBeNull();
      });
    });

    describe('null cause (for backwards compatibility with older versions)', () => {
      const err = new Cons(null, 'my error');
      const nodestack = common.getNodeStack();

      it('has a good message', () => {
        expect(err.message).toBe('my error');
      });

      it('has a good cause', () => {
        expect(VError.cause(err)).toBeNull();
      });

      it('has a good stack', () => {
        const stack = common.cleanStack(err.stack);

        expect(stack).toBe(`${[
          `${stackname}: my error`,
          '    at Suite.<anonymous> (dummy filename)'
        ].join('\n')}\n${nodestack}`);
      });
    });

    describe('null cause in option-argument (for backwards compatibility with older versions)', () => {
      const err = new Cons({ cause: null }, 'my error');

      it('has a good message', () => {
        expect(err.message).toBe('my error');
      });

      it('has a good cause', () => {
        expect(VError.cause(err)).toBeNull();
      });
    });

    describe('null cause without message (for backwards compatibility with older versions)', () => {
      const err = new Cons(null);
      const nodestack = common.getNodeStack();

      it('has a good message', () => {
        expect(err.message).toBe('');
      });

      it('has a good cause', () => {
        expect(VError.cause(err)).toBeNull();
      });

      it('has a good stack', () => {
        const stack = common.cleanStack(err.stack);

        expect(stack).toBe(`${[
          `${stackname}: `,
          '    at Suite.<anonymous> (dummy filename)'
        ].join('\n')}\n${nodestack}`);
      });
    });

    describe('constructorOpt', () => {
      function makeErr(options) {
        return (new Cons(options, 'test error'));
      }

      it('without constructorOpt option', () => {
        const err = makeErr({});
        const stack = common.cleanStack(err.stack);
        const nodestack = common.getNodeStack();

        expect(stack).toBe(`${[
          `${stackname}: test error`,
          '    at makeErr (dummy filename)',
          '    at Object.<anonymous> (dummy filename)'
        ].join('\n')}\n${nodestack}`);
      });

      it('with constructorOpt option', () => {
        const err = makeErr({ constructorOpt: makeErr });
        const stack = common.cleanStack(err.stack);
        const nodestack = common.getNodeStack();

        expect(stack).toBe(`${[
          `${stackname}: test error`,
          '    at Object.<anonymous> (dummy filename)'
        ].join('\n')}\n${nodestack}`);
      });
    });

    describe('invoked without "new"', () => {
      const err = Cons('my %s string', 'testing!');

      it('has a good name', () => {
        expect(err.name).toBe(label);
      });

      it('is an instance of Error', () => {
        expect(err).toBeInstanceOf(Error);
      });

      it(`is an instance of ${label}`, () => {
        expect(err).toBeInstanceOf(Cons);
      });

      it('has a good message', () => {
        expect(err.message).toBe('my testing! string');
      });
    });

    describe('custom "name"', () => {
      const err = new Cons({ name: 'SomeOtherError' }, 'another kind of error');
      const nodestack = common.getNodeStack();

      it('has a good name', () => {
        expect(err.name).toBe('SomeOtherError');
      });

      it('is an instance of Error', () => {
        expect(err).toBeInstanceOf(Error);
      });

      it(`is an instance of ${label}`, () => {
        expect(err).toBeInstanceOf(Cons);
      });

      it('has a good message', () => {
        expect(err.message).toBe('another kind of error');
      });

      it('has a good stack', () => {
        const stack = common.cleanStack(err.stack);

        expect(stack).toBe(`${[
          'SomeOtherError: another kind of error',
          '    at Suite.<anonymous> (dummy filename)'
        ].join('\n')}\n${nodestack}`);
      });
    });
  });
}

describe('common', () => {
  Error.stackTraceLimit = 25;

  runTests(VError, 'VError');
  runTests(WError, 'WError');
});
