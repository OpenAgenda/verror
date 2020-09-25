/*
 * tst.context.js: tests that cause works with errors from different contexts.
 */

const vm = require('vm');
const VError = require('../lib/verror');

const prog1 = 'callback(new Error(), "Error")';
const prog2 = 'const e = new Error(); e.name = "BarError"; callback(e, "BarError")';

/*
 * We run the same set of tests using two different errors: one whose name is
 * the default "Error", and one whose name has been changed.
 *
 * Note that changing the name is not the same as having a constructor that
 * inherits from Error. Such Errors are not currently supported when
 * constructed in another context.
 */

describe('context', () => {
  function runTests(cerr, name) {
    /*
     * The constructor should recognize the other context's Error as an
     * error for wrapping, and not as an options object.
     */
    it('recognize context\'s Error with cause as argument', () => {
      const verr = new VError(cerr);
      expect(VError.cause(verr)).toBe(cerr);
    });

    it('recognize context\'s Error with cause in option-argument', () => {
      const verr = new VError({ cause: cerr });
      expect(VError.cause(verr)).toBe(cerr);
    });

    /*
     * The assertions done at each step while walking the cause chain
     * should be okay with the other context's Error.
     */
    it('findCauseByName with a bad cause', () => {
      expect(VError.findCauseByName(cerr, 'FooError')).toBeNull();
    });

    it('findCauseByName with a valid cause', () => {
      const verr = new VError(cerr);
      expect(VError.findCauseByName(verr, name)).toBe(cerr);
    });

    /*
     * Verify that functions that take an Error as an argument
     * accept the Error created in the other context.
     */
    it('has a good cause', () => {
      expect(VError.cause(cerr)).toBeNull();
    });

    it('has a good info', () => {
      expect(VError.info(cerr)).toEqual({});
    });

    it('has a stack', () => {
      expect(typeof VError.fullStack(cerr)).toBe('string');
    });
  }

  const context = vm.createContext({
    callback: runTests
  });

  describe('prog 1', () => {
    vm.runInContext(prog1, context);
  });

  describe('prog 2', () => {
    vm.runInContext(prog2, context);
  });
});
