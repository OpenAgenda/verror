/*
 * tst.VError.js: tests functionality that's specific to the VError class.
 */

const verror = require('../lib');
const common = require('./utils');

const VError = verror.VError;
const WError = verror.WError;

it('VError', () => {
  const nodestack = new Error().stack.split('\n').slice(2).join('\n');

  let err, suberr, stack;

  /* "null" or "undefined" as string for sprintf-js */
  err = new VError('my %s string', null);
  expect(err.message).toBe('my null string');
  err = new VError('my %s string', undefined);
  expect(err.message).toBe('my undefined string');

  /* caused by another error, with no additional message */
  suberr = new Error('root cause');
  err = new VError(suberr);
  expect(err.message).toBe('root cause');
  expect(VError.cause(err) === suberr).toBeTruthy();

  err = new VError({ 'cause': suberr });
  expect(err.message).toBe('root cause');
  expect(VError.cause(err) === suberr).toBeTruthy();

  /* caused by another error, with annotation */
  err = new VError(suberr, 'proximate cause: %d issues', 3);
  expect(err.message).toBe('proximate cause: 3 issues: root cause');
  expect(VError.cause(err) === suberr).toBeTruthy();
  stack = common.cleanStack(err.stack);
  expect(stack).toBe([
    'VError: proximate cause: 3 issues: root cause',
    '    at Object.<anonymous> (dummy filename)'
  ].join('\n') + '\n' + nodestack);

  /* caused by another VError, with annotation. */
  suberr = err;
  err = new VError(suberr, 'top');
  expect(err.message).toBe('top: proximate cause: 3 issues: root cause');
  expect(VError.cause(err) === suberr).toBeTruthy();

  err = new VError({ 'cause': suberr }, 'top');
  expect(err.message).toBe('top: proximate cause: 3 issues: root cause');
  expect(VError.cause(err) === suberr).toBeTruthy();

  /* caused by a WError */
  suberr = new WError(new Error('root cause'), 'mid');
  err = new VError(suberr, 'top');
  expect(err.message).toBe('top: mid');
  expect(VError.cause(err) === suberr).toBeTruthy();

  /* empty message */
  err = new VError(new VError(new VError(new VError('Test')), 'Ok'))
  expect(err.message).toBe('Ok: Test');

  /* fullStack */
  suberr = new VError(new Error('root cause'), 'mid');
  err = new VError(suberr, 'top');
  stack = common.cleanStack(VError.fullStack(err));
  expect(stack).toBe([
    'VError: top: mid: root cause',
    '    at Object.<anonymous> (dummy filename)'
  ].join('\n') + '\n' + nodestack + '\n' + [
    'caused by: VError: mid: root cause',
    '    at Object.<anonymous> (dummy filename)'
  ].join('\n') + '\n' + nodestack + '\n' + [
    'caused by: Error: root cause',
    '    at Object.<anonymous> (dummy filename)'
  ].join('\n') + '\n' + nodestack);
});
