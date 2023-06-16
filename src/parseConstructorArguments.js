import { sprintf } from 'sprintf-js';
import AssertionError from 'assertion-error';
import { isError, isObject, isString } from './assert';

/*
 * Common function used to parse constructor arguments for VError and WError.
 * Named arguments to this function:
 *
 *     ...argv    error's constructor arguments, which are to be
 *                interpreted as described in README.md.  For quick
 *                reference, "argv" has one of the following forms:
 *
 *            [ sprintfArgs... ]           (argv[0] is a string)
 *            [ cause, sprintfArgs... ]    (argv[0] is an Error)
 *            [ options, sprintfArgs... ]  (argv[0] is an object)
 *
 * This function normalizes these forms, producing an object with the following
 * properties:
 *
 *    options    equivalent to "options" in third form.  This will never
 *               be a direct reference to what the caller passed in
 *               (i.e., it may be a shallow copy), so it can be freely
 *               modified.
 *
 *    shortMessage    result of sprintf(sprintfArgs), taking options.strict
 *                    into account as described in README.md.
 */
export default function parseConstructorArguments(...argv) {
  let options;
  let sprintfArgs;

  /*
   * First, figure out which form of invocation we've been given.
   */
  if (argv.length === 0) {
    options = {};
    sprintfArgs = [];
  } else if (isError(argv[0])) {
    options = { cause: argv[0] };
    sprintfArgs = argv.slice(1);
  } else if (typeof argv[0] === 'object') {
    options = {};
    for (const k in argv[0]) {
      if (Object.prototype.hasOwnProperty.call(argv[0], k)) {
        options[k] = argv[0][k];
      }
    }
    sprintfArgs = argv.slice(1);
  } else {
    if (!isString(argv[0])) {
      throw new AssertionError(
        'first argument to VError, or WError ' +
        'constructor must be a string, object, or Error'
      );
    }
    options = {};
    sprintfArgs = argv;
  }

  if (!isObject(options)) throw new AssertionError('options (object) is required');
  if (options.meta && !isObject(options.meta)) throw new AssertionError('options.meta must be an object');

  return {
    options,
    shortMessage: sprintfArgs.length === 0 ? '' : sprintf.apply(null, sprintfArgs)
  };
};
