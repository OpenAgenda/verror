'use strict';

/*
 * common utility functions used in multiple tests
 */

const stackTraceRe = new RegExp('\\(/.*/*\.test\.js:\\d+:\\d+\\)', 'gm');

/*
 * Remove full paths and relative line numbers from stack traces so that we can
 * compare against "known-good" output.
 */
function cleanStack(stacktxt) {
  return stacktxt.replace(stackTraceRe, '(dummy filename)');
}

/*
 * Save the generic parts of all stack traces so we can avoid hardcoding
 * Node-specific implementation details in our testing of stack traces.
 * The stack trace limit has to be large enough to capture all of Node's frames,
 * which are more than the default (10 frames) in Node v6.x.
 */
function getNodeStack(sliceStart = 3, sliceEnd) {
  return cleanStack(new Error().stack.split('\n').slice(sliceStart, sliceEnd).join('\n'));
}

/*
 * Node's behavior with respect to Error's names and messages changed
 * significantly with v0.12, so a number of tests regrettably need to check for
 * that.
 */
function oldNode() {
  return /^0\.10\./.test(process.versions.node);
}

module.exports = {
  cleanStack,
  getNodeStack,
  oldNode
};
