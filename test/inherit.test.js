/*
 * tst.inherit.js: test that inheriting from VError and WError work as expected.
 */

const common = require('./utils');

const { VError, WError } = require('../lib');

class VErrorChild extends VError {
}
VErrorChild.prototype.name = 'VErrorChild';

class WErrorChild extends WError {
}
WErrorChild.prototype.name = 'WErrorChild';

class VErrorChildNoName extends VError {
}

class WErrorChildNoName extends WError {
}


describe('inherit', () => {
  it('extend VError with a cause and a message', () => {
    const suberr = new Error('root cause');
    const err = new VErrorChild(suberr, 'top');
    const nodestack = common.getNodeStack();

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(VError);
    expect(err).toBeInstanceOf(VErrorChild);
    expect(VError.cause(err)).toBe(suberr);
    expect(err.message).toBe('top: root cause');
    expect(err.toString()).toBe('VErrorChild: top: root cause');

    const stack = common.cleanStack(err.stack);

    expect(stack).toBe([
      'VErrorChild: top: root cause',
      '    at Object.<anonymous> (dummy filename)',
      nodestack
    ].join('\n'));
  });

  it('extend VError with a cause', () => {
    const suberr = new Error('root cause');
    const err = new VErrorChild(suberr);
    const nodestack = common.getNodeStack();

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(VError);
    expect(err).toBeInstanceOf(VErrorChild);
    expect(VError.cause(err)).toBe(suberr);
    expect(err.message).toBe('root cause');
    expect(err.toString()).toBe('VErrorChild: root cause');

    const stack = common.cleanStack(err.stack);

    expect(stack).toBe([
      'VErrorChild: root cause',
      '    at Object.<anonymous> (dummy filename)',
      nodestack
    ].join('\n'));
  });

  it('extend WError with a cause', () => {
    const suberr = new Error('root cause');
    const err = new WErrorChild(suberr, 'top');
    const nodestack = common.getNodeStack();

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(WError);
    expect(err).toBeInstanceOf(WErrorChild);
    expect(VError.cause(err)).toBe(suberr);
    expect(err.message).toBe('top');
    expect(err.toString()).toBe('WErrorChild: top; caused by Error: root cause');

    const stack = common.cleanStack(err.stack);
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
        'WErrorChild: top; caused by Error: root cause',
        '    at Object.<anonymous> (dummy filename)',
        nodestack
      ].join('\n'));
    } else {
      expect(stack).toBe([
        'WErrorChild: top',
        '    at Object.<anonymous> (dummy filename)',
        nodestack
      ].join('\n'));
    }
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
