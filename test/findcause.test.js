/*
 * tst.findcause.js: tests findCauseByName()/hasCauseWithName()/findCauseByType()/hasCauseWithType().
 */

const util = require('util');
const {
  VError,
  WError,
  findCauseByName,
  hasCauseWithName,
  findCauseByType,
  hasCauseWithType
} = require('../lib');

/*
  * This class deliberately doesn't inherit from our error classes.
  */
class MyError extends Error {
  constructor() {
    super('gna gna gna');
  }
}
MyError.prototype.name = 'MyError';

/*
 * We'll build up a cause chain using each of our classes and make sure
 * that findCauseByName() traverses all the way to the bottom.  This
 * ends up testing that findCauseByName() works with each of these
 * classes.
 */

describe('find cause', () => {
  const err = new Error('a very basic error');
  const err1 = new MyError();
  const err2 = new VError({
    'name': 'ErrorTwo',
    'cause': err1
  }, 'basic verror (number two)');
  const err3 = new WError({
    'name': 'ErrorThree',
    'cause': err2
  }, 'werror (number Three)');

  it('err3', () => {
    expect(findCauseByName(err3, 'ErrorFour')).toBeNull();
    expect(hasCauseWithName(err3, 'ErrorFour')).toBeFalsy();
    expect(findCauseByName(err3, 'ErrorThree')).toBe(err3);
    expect(hasCauseWithName(err3, 'ErrorThree')).toBeTruthy();
    expect(findCauseByName(err3, 'ErrorTwo')).toBe(err2);
    expect(hasCauseWithName(err3, 'ErrorTwo')).toBeTruthy();
    expect(findCauseByName(err3, 'MyError')).toBe(err1);
    expect(hasCauseWithName(err3, 'MyError')).toBeTruthy();
    expect(findCauseByType(err3, MyError)).toBe(err1);
    expect(hasCauseWithType(err3, MyError)).toBeTruthy();
  });

  it('err2', () => {
    expect(findCauseByName(err2, 'ErrorFour')).toBeNull();
    expect(hasCauseWithName(err2, 'ErrorFour')).toBeFalsy();
    expect(findCauseByName(err2, 'ErrorThree')).toBeNull();
    expect(hasCauseWithName(err2, 'ErrorThree')).toBeFalsy();
    expect(findCauseByName(err2, 'ErrorTwo')).toBe(err2);
    expect(hasCauseWithName(err2, 'ErrorTwo')).toBeTruthy();
    expect(findCauseByName(err2, 'MyError')).toBe(err1);
    expect(hasCauseWithName(err2, 'MyError')).toBeTruthy();
    expect(findCauseByType(err2, MyError)).toBe(err1);
    expect(hasCauseWithType(err2, MyError)).toBeTruthy();
  });

  /*
   * These functions must work on non-VError errors.
   */
  it('err1', () => {
    expect(findCauseByName(err1, 'ErrorTwo')).toBeNull();
    expect(hasCauseWithName(err1, 'ErrorTwo')).toBeFalsy();
    expect(findCauseByName(err1, 'MyError')).toBe(err1);
    expect(hasCauseWithName(err1, 'MyError')).toBeTruthy();
    expect(findCauseByType(err1, MyError)).toBe(err1);
    expect(hasCauseWithType(err1, MyError)).toBeTruthy();
  });

  it('err', () => {
    expect(findCauseByName(err, 'Error')).toBe(err);
    expect(hasCauseWithName(err, 'Error')).toBeTruthy();
    expect(findCauseByName(err, 'MyError')).toBeNull();
    expect(hasCauseWithName(err, 'MyError')).toBeFalsy();
    expect(findCauseByType(err, Error)).toBe(err);
    expect(hasCauseWithType(err, Error)).toBeTruthy();
  });

  /*
   * These functions should throw an Error when given bad argument types.
   */
  it('non-Error', () => {
    expect(() => findCauseByName(null, 'AnError')).toThrow();
    expect(() => findCauseByName(err1, null)).toThrow();
    expect(() => hasCauseWithName(null, 'AnError')).toThrow();
    expect(() => hasCauseWithName(err1, null)).toThrow();
    expect(() => findCauseByType(null, 'AnError')).toThrow();
    expect(() => findCauseByType(err1, null)).toThrow();
    expect(() => hasCauseWithType(null, 'AnError')).toThrow();
    expect(() => hasCauseWithType(err1, null)).toThrow();
  });
});
