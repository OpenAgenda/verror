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
} = require('../lib/verror');

/*
  * This class deliberately doesn't inherit from our error classes.
  */
function MyError() {
  Error.call(this, 'here is my error');
}

util.inherits(MyError, Error);
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

  // err 3
  it('ErrorFour is not found in err3 causes', () => {
    expect(findCauseByName(err3, 'ErrorFour')).toBeNull();
  });

  it('err3 has not ErrorFour in its causes', () => {
    expect(hasCauseWithName(err3, 'ErrorFour')).toBeFalsy();
  });

  it('ErrorThree is found in err3 causes', () => {
    expect(findCauseByName(err3, 'ErrorThree')).toBe(err3);
  });

  it('err3 has ErrorThree in its causes', () => {
    expect(hasCauseWithName(err3, 'ErrorThree')).toBeTruthy();
  });

  it('ErrorTwo is found in err3 causes', () => {
    expect(findCauseByName(err3, 'ErrorTwo')).toBe(err2);
  });

  it('err3 has ErrorTwo in its causes', () => {
    expect(hasCauseWithName(err3, 'ErrorTwo')).toBeTruthy();
  });

  it('MyError is found in err3 causes', () => {
    expect(findCauseByName(err3, 'MyError')).toBe(err1);
  });

  it('err3 has MyError in its causes', () => {
    expect(hasCauseWithName(err3, 'MyError')).toBeTruthy();
  });

  it('MyError is found in err3 causes (by type)', () => {
    expect(findCauseByType(err3, MyError)).toBe(err1);
  });

  it('err3 has MyError in its causes (by type)', () => {
    expect(hasCauseWithType(err3, MyError)).toBeTruthy();
  });

  // err2
  it('ErrorFour is not found in err2 causes', () => {
    expect(findCauseByName(err2, 'ErrorFour')).toBeNull();
  });

  it('err2 has not ErrorFour in its causes', () => {
    expect(hasCauseWithName(err2, 'ErrorFour')).toBeFalsy();
  });

  it('ErrorThree is not found in err2 causes', () => {
    expect(findCauseByName(err2, 'ErrorThree')).toBeNull();
  });

  it('err2 has not ErrorThree in its causes', () => {
    expect(hasCauseWithName(err2, 'ErrorThree')).toBeFalsy();
  });

  it('ErrorTwo is found in err2 causes', () => {
    expect(findCauseByName(err2, 'ErrorTwo')).toBe(err2);
  });

  it('err2 has ErrorTwo in its causes', () => {
    expect(hasCauseWithName(err2, 'ErrorTwo')).toBeTruthy();
  });

  it('MyError is found in err2 causes', () => {
    expect(findCauseByName(err2, 'MyError')).toBe(err1);
  });

  it('err2 has MyError in its causes', () => {
    expect(hasCauseWithName(err2, 'MyError')).toBeTruthy();
  });

  it('MyError is found in err2 causes (by type)', () => {
    expect(findCauseByType(err2, MyError)).toBe(err1);
  });

  it('err2 has MyError in its causes (by type)', () => {
    expect(hasCauseWithType(err2, MyError)).toBeTruthy();
  });

  /*
   * These functions must work on non-VError errors.
   */

  // err1
  it('ErrorTwo is not found in err1 causes', () => {
    expect(findCauseByName(err1, 'ErrorTwo')).toBeNull();
  });

  it('err1 has not ErrorTwo in its causes', () => {
    expect(hasCauseWithName(err1, 'ErrorTwo')).toBeFalsy();
  });

  it('MyError is found in err1 causes', () => {
    expect(findCauseByName(err1, 'MyError')).toBe(err1);
  });

  it('err1 has MyError in its causes', () => {
    expect(hasCauseWithName(err1, 'MyError')).toBeTruthy();
  });

  it('MyError is found in err1 causes (by type)', () => {
    expect(findCauseByType(err1, MyError)).toBe(err1);
  });

  it('err1 has MyError in its causes (by type)', () => {
    expect(hasCauseWithType(err1, MyError)).toBeTruthy();
  });

  // err
  it('Error is found in err causes', () => {
    expect(findCauseByName(err, 'Error')).toBe(err);
  });

  it('err has Error in its causes', () => {
    expect(hasCauseWithName(err, 'Error')).toBeTruthy();
  });

  it('MyError is not found in err causes', () => {
    expect(findCauseByName(err, 'MyError')).toBeNull();
  });

  it('err has not MyError in its causes', () => {
    expect(hasCauseWithName(err, 'MyError')).toBeFalsy();
  });

  it('Error is found in err causes (by type)', () => {
    expect(findCauseByType(err, Error)).toBe(err);
  });

  it('err has Error in its causes (by type)', () => {
    expect(hasCauseWithType(err, Error)).toBeTruthy();
  });

  /*
   * These functions should throw an Error when given bad argument types.
   */
  it('findCauseByName throws with bad first argument', () => {
    expect(() => findCauseByName(null, 'AnError')).toThrow();
  });

  it('findCauseByName throws with bad second argument', () => {
    expect(() => findCauseByName(err1, null)).toThrow();
  });

  it('hasCauseWithName throws with bad first argument', () => {
    expect(() => hasCauseWithName(null, 'AnError')).toThrow();
  });

  it('hasCauseWithName throws with bad second argument', () => {
    expect(() => hasCauseWithName(err1, null)).toThrow();
  });

  it('findCauseByType throws with bad first argument', () => {
    expect(() => findCauseByType(null, 'AnError')).toThrow();
  });

  it('findCauseByType throws with bad second argument', () => {
    expect(() => findCauseByType(err1, null)).toThrow();
  });

  it('hasCauseWithType throws with bad first argument', () => {
    expect(() => hasCauseWithType(null, 'AnError')).toThrow();
  });

  it('hasCauseWithType throws with bad second argument', () => {
    expect(() => hasCauseWithType(err1, null)).toThrow();
  });
});
