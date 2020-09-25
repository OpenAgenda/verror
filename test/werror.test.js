/*
 * tst.werror.js: tests basic functionality specific to the WError class.
 */

const verror = require('../lib/verror');
const common = require('./common');

const VError = verror.VError;
const WError = verror.WError;

it('WError', () => {
  const nodestack = common.getNodeStack();

  let err, suberr, stack, stackmessageTop, stackmessageMid;

  /*
   * Most of the test cases here have analogs in tst.common.js.  In this
   * test, we check for WError-specific behavior (e.g., toString()).
   */

  /* no arguments */
  err = new WError();
  expect(err.toString()).toEqual('WError');
  expect(VError.cause(err) === null).toBeTruthy();
  stack = common.cleanStack(err.stack);
  expect(stack).toEqual([
    'WError: ',
    '    at Object.<anonymous> (dummy filename)'
  ].join('\n') + '\n' + nodestack);

  /* options-argument form */
  err = new WError({});
  expect(err.toString()).toEqual('WError');
  expect(VError.cause(err) === null).toBeTruthy();

  /* simple message */
  err = new WError('my error');
  expect(err.message).toEqual('my error');
  expect(err.toString()).toEqual('WError: my error');
  expect(VError.cause(err) === null).toBeTruthy();
  stack = common.cleanStack(err.stack);
  expect(stack).toEqual([
    'WError: my error',
    '    at Object.<anonymous> (dummy filename)'
  ].join('\n') + '\n' + nodestack);

  err = new WError({}, 'my error');
  expect(err.toString()).toEqual('WError: my error');
  expect(VError.cause(err) === null).toBeTruthy();

  /* caused by another error, with no additional message */
  suberr = new Error('root cause');
  err = new WError(suberr);
  expect(err.message).toEqual('');
  expect(err.toString()).toEqual('WError; caused by Error: root cause');
  expect(VError.cause(err) === suberr).toBeTruthy();

  err = new WError({ 'cause': suberr });
  expect(err.message).toEqual('');
  expect(err.toString()).toEqual('WError; caused by Error: root cause');
  expect(VError.cause(err) === suberr).toBeTruthy();

  /* caused by another error, with annotation */
  err = new WError(suberr, 'proximate cause: %d issues', 3);
  expect(err.message).toEqual('proximate cause: 3 issues');
  expect(err.toString()).toEqual('WError: proximate cause: 3 issues; ' +
    'caused by Error: root cause');
  expect(VError.cause(err) === suberr).toBeTruthy();
  stack = common.cleanStack(err.stack);
  /* See the comment in tst.inherit.js. */
  stackmessageTop = common.oldNode() ?
    'WError: proximate cause: 3 issues; caused by Error: root cause' :
    'WError: proximate cause: 3 issues';
  expect(stack).toEqual([
    stackmessageTop,
    '    at Object.<anonymous> (dummy filename)'
  ].join('\n') + '\n' + nodestack);

  err = new WError({ 'cause': suberr }, 'proximate cause: %d issues', 3);
  expect(err.message).toEqual('proximate cause: 3 issues');
  expect(err.toString()).toEqual('WError: proximate cause: 3 issues; ' +
    'caused by Error: root cause');
  expect(VError.cause(err) === suberr).toBeTruthy();
  stack = common.cleanStack(err.stack);
  expect(stack).toEqual([
    stackmessageTop,
    '    at Object.<anonymous> (dummy filename)'
  ].join('\n') + '\n' + nodestack);

  /* caused by another WError, with annotation. */
  suberr = err;
  err = new WError(suberr, 'top');
  expect(err.message).toEqual('top');
  expect(err.toString()).toEqual('WError: top; caused by WError: ' +
    'proximate cause: 3 issues; caused by Error: root cause');
  expect(VError.cause(err) === suberr).toBeTruthy();

  err = new WError({ 'cause': suberr }, 'top');
  expect(err.message).toEqual('top');
  expect(err.toString()).toEqual('WError: top; caused by WError: ' +
    'proximate cause: 3 issues; caused by Error: root cause');
  expect(VError.cause(err) === suberr).toBeTruthy();

  /* caused by a VError */
  suberr = new VError(new Error('root cause'), 'mid');
  err = new WError(suberr, 'top');
  expect(err.message).toEqual('top');
  expect(err.toString()).toEqual('WError: top; caused by VError: mid: root cause');
  expect(VError.cause(err) === suberr).toBeTruthy();

  /* fullStack */
  suberr = new WError(new Error('root cause'), 'mid');
  err = new WError(suberr, 'top');
  stack = common.cleanStack(VError.fullStack(err));
  /* See the comment in tst.inherit.js. */
  stackmessageMid = common.oldNode() ?
    'WError: mid; caused by Error: root cause' :
    'WError: mid';
  stackmessageTop = common.oldNode() ?
    'WError: top; caused by ' + stackmessageMid :
    'WError: top';
  expect(stack).toEqual([
    stackmessageTop,
    '    at Object.<anonymous> (dummy filename)'
  ].join('\n') + '\n' + nodestack + '\n' + [
    'caused by: ' + stackmessageMid,
    '    at Object.<anonymous> (dummy filename)'
  ].join('\n') + '\n' + nodestack + '\n' + [
    'caused by: Error: root cause',
    '    at Object.<anonymous> (dummy filename)'
  ].join('\n') + '\n' + nodestack);
});
