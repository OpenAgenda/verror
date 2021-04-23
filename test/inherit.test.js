/*
 * tst.inherit.js: test that inheriting from VError and WError work as expected.
 */

const VError = require('../lib');
const common = require('./utils');

const { HttpError } = VError;

function runTests(Cons, label, isHttpError = true) {
  class Child extends Cons {
  }
  Child.prototype.name = 'Child';

  class ChildNoName extends Cons {
  }

  describe(label, () => {
    it('extend with a cause and a message', () => {
      const suberr = new Error('root cause');
      const err = new Child(suberr, 'top');
      const nodestack = common.getNodeStack();

      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(VError);
      expect(err).toBeInstanceOf(Child);
      expect(VError.cause(err)).toBe(suberr);

      if (isHttpError) {
        expect(err).toBeInstanceOf(HttpError);
        expect(typeof err.code).toBe('number');
        expect(typeof err.className).toBe('string');
      }

      const stack = common.cleanStack(err.stack);

      if (label === 'WError') {
        expect(err.message).toBe('top');
        expect(err.toString()).toBe('Child: top; caused by Error: root cause');

        /*
         * On Node 0.10 and earlier, the 'stack' property appears to use the error's
         * toString() method.  On newer versions, it appears to use the message
         * property the first time err.stack is accessed (_not_ when it was
         * constructed).  Since the point of WError is to omit the cause messages from
         * the WError's message, there's no way to have the err.stack property show the
         * detailed message in Node 0.12 and later.
         */
        if (common.oldNode()) {
          expect(stack).toBe([
            'Child: top; caused by Error: root cause',
            '    at Object.<anonymous> (dummy filename)',
            nodestack
          ].join('\n'));
        } else {
          expect(stack).toBe([
            'Child: top',
            '    at Object.<anonymous> (dummy filename)',
            nodestack
          ].join('\n'));
        }
      } else { // non-WError
        expect(err.message).toBe('top: root cause');
        expect(err.toString()).toBe('Child: top: root cause');
        expect(stack).toBe([
          'Child: top: root cause',
          '    at Object.<anonymous> (dummy filename)',
          nodestack
        ].join('\n'));
      }
    });

    describe('"<Ctor>.toString()" uses the constructor name', () => {
      it('extends without name', () => {
        const err = new ChildNoName('top');

        expect(err.toString()).toBe('ChildNoName: top');
      });

      it('set name to an instance of a VError', () => {
        const err = new Cons('top');
        err.name = 'CustomNameError';

        expect(err.toString()).toBe('CustomNameError: top');
      });
    });
  });
}

describe('inherit', () => {
  runTests(VError, 'VError', false);
  runTests(VError.WError, 'WError', false);
  runTests(VError.HttpError, 'HttpError');
  runTests(VError.BadRequest, 'BadRequest');
  runTests(VError.NotAuthenticated, 'NotAuthenticated');
  runTests(VError.PaymentError, 'PaymentError');
  runTests(VError.Forbidden, 'Forbidden');
  runTests(VError.NotFound, 'NotFound');
  runTests(VError.MethodNotAllowed, 'MethodNotAllowed');
  runTests(VError.NotAcceptable, 'NotAcceptable');
  runTests(VError.Timeout, 'Timeout');
  runTests(VError.Conflict, 'Conflict');
  runTests(VError.Gone, 'Gone');
  runTests(VError.LengthRequired, 'LengthRequired');
  runTests(VError.Unprocessable, 'Unprocessable');
  runTests(VError.TooManyRequests, 'TooManyRequests');
  runTests(VError.GeneralError, 'GeneralError');
  runTests(VError.NotImplemented, 'NotImplemented');
  runTests(VError.BadGateway, 'BadGateway');
  runTests(VError.Unavailable, 'Unavailable');
});
