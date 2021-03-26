/*
 * tst.inherit.js: test that inheriting from VError and WError work as expected.
 */

const util = require('util');
const common = require('./utils');

const { VError, WError } = require('../lib');

class VErrorChild extends VError {
}

util.inherits(VErrorChild, VError);
VErrorChild.prototype.name = 'VErrorChild';


class WErrorChild extends WError {
}

util.inherits(WErrorChild, WError);
WErrorChild.prototype.name = 'WErrorChild';

class VErrorChildNoName extends VError {
}

util.inherits(VErrorChildNoName, VError);

class WErrorChildNoName extends WError {
}

util.inherits(WErrorChildNoName, WError);

describe('inherits', () => {
  describe('extend VError with a cause and a message', () => {
    const suberr = new Error('root cause');
    const err = new VErrorChild(suberr, 'top');
    const nodestack = common.getNodeStack();

    it('is an instance of Error', () => {
      expect(err).toBeInstanceOf(Error);
    });

    it('is an instance of VError', () => {
      expect(err).toBeInstanceOf(VError);
    });

    it('is an instance of VErrorChild', () => {
      expect(err).toBeInstanceOf(VErrorChild);
    });

    it('has good cause', () => {
      expect(VError.cause(err)).toBe(suberr);
    });

    it('has good message', () => {
      expect(err.message).toBe('top: root cause');
    });

    it('has good result with .toString', () => {
      expect(err.toString()).toBe('VErrorChild: top: root cause');
    });

    it('has good stack', () => {
      const stack = common.cleanStack(err.stack);
      const adjustedStack = stack.split('\n').slice(0, -1).join('\n');

      expect(adjustedStack).toBe([
        'VErrorChild: top: root cause',
        '    at Suite.<anonymous> (dummy filename)',
        nodestack
      ].join('\n'));
    });
  });

  describe('extend VError with a cause', () => {
    const suberr = new Error('root cause');
    const err = new VErrorChild(suberr);
    const nodestack = common.getNodeStack();

    it('is an instance of Error', () => {
      expect(err).toBeInstanceOf(Error);
    });

    it('is an instance of VError', () => {
      expect(err).toBeInstanceOf(VError);
    });

    it('is an instance of VErrorChild', () => {
      expect(err).toBeInstanceOf(VErrorChild);
    });

    it('has good cause', () => {
      expect(VError.cause(err)).toBe(suberr);
    });

    it('has good message', () => {
      expect(err.message).toBe('root cause');
    });

    it('has good result with .toString', () => {
      expect(err.toString()).toBe('VErrorChild: root cause');
    });

    it('has good stack', () => {
      const stack = common.cleanStack(err.stack);
      const adjustedStack = stack.split('\n').slice(0, -1).join('\n');

      expect(adjustedStack).toBe([
        'VErrorChild: root cause',
        '    at Suite.<anonymous> (dummy filename)',
        nodestack
      ].join('\n'));
    });
  });

  describe('extend WError with a cause', () => {
    const suberr = new Error('root cause');
    const err = new WErrorChild(suberr, 'top');
    const nodestack = common.getNodeStack();

    it('is an instance of Error', () => {
      expect(err).toBeInstanceOf(Error);
    });

    it('is an instance of Error', () => {
      expect(err).toBeInstanceOf(WError);
    });

    it('is an instance of Error', () => {
      expect(err).toBeInstanceOf(WErrorChild);
    });

    it('has good cause', () => {
      expect(VError.cause(err)).toBe(suberr);
    });

    it('has good message', () => {
      expect(err.message).toBe('top');
    });

    it('has good result with .toString', () => {
      expect(err.toString()).toBe('WErrorChild: top; caused by Error: root cause');
    });

    it('has good stack', () => {
      const stack = common.cleanStack(err.stack);
      const adjustedStack = stack.split('\n').slice(0, -1).join('\n');
      /*
       * On Node 0.10 and earlier, the 'stack' property appears to use the error's
       * toString() method.  On newer versions, it appears to use the message
       * property the first time err.stack is accessed (_not_ when it was
       * constructed).  Since the point of WError is to omit the cause messages from
       * the WError's message, there's no way to have the err.stack property show the
       * detailed message in Node 0.12 and later.
       */
      if (common.oldNode()) {
        expect(adjustedStack).toBe([
          'WErrorChild: top; caused by Error: root cause',
          '    at Suite.<anonymous> (dummy filename)',
          nodestack
        ].join('\n'));
      } else {
        expect(adjustedStack).toBe([
          'WErrorChild: top',
          '    at Suite.<anonymous> (dummy filename)',
          nodestack
        ].join('\n'));
      }
    });
  });

  describe('"<Ctor>.toString()" uses the constructor name', () => {
    it('extends VError without name', () => {
      const err = new VErrorChildNoName('top');

      expect(err.toString()).toBe('VErrorChildNoName: top');
    });

    it('extends WError without name', () => {
      const err = new WErrorChildNoName('top');

      expect(err.toString()).toBe('WErrorChildNoName: top');
    });

    it('set name to an instance of a VError', () => {
      const err = new VError('top');
      err.name = 'CustomNameError';

      expect(err.toString()).toBe('CustomNameError: top');
    });

    it('set name to an instance of a WError', () => {
      const err = new WError('top');
      err.name = 'CustomNameError';

      expect(err.toString()).toBe('CustomNameError: top');
    });
  });
});
