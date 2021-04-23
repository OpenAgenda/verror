/*
 * verror.js: richer JavaScript errors
 */

import AssertionError from 'assertion-error';
import { isError, isFunc, isObject, isString } from './assert';
import parseConstructorArguments from './parseConstructorArguments';
import { defineProperty, defineProperties, inheritsFrom } from './utils';

const META = '@@verror/meta';

const reserved = [
  'name',
  'message',
  'shortMessage',
  'cause',
  'info',
  'stack',
  'fileName',
  'lineNumber'
];


function mergeMeta(instance, meta) {
  if (!meta) {
    return;
  }

  for (const k in meta) {
    if (Object.prototype.hasOwnProperty.call(meta, k)) {
      if (reserved.includes(k)) {
        throw new AssertionError(`"${k}" is a reserved meta`);
      }

      instance[META][k] = meta[k];
      instance[k] = meta[k];
    }
  }
}

/*
 * See README.md for reference documentation.
 */
function VError(...args) {
  /*
   * This is a regrettable pattern, but JavaScript's built-in Error class
   * is defined to work this way, so we allow the constructor to be called
   * without "new".
   */
  if (!(this instanceof VError)) {
    return new VError(...args);
  }

  /*
   * For convenience and backwards compatibility, we support several
   * different calling forms. Normalize them here.
   */
  const { options, shortMessage } = parseConstructorArguments(...args);
  const { cause, constructorOpt, info, name, skipCauseMessage, meta } = options;
  let message = shortMessage;

  /*
   * If we've been given a cause, record a reference to it and update our
   * message appropriately.
   */
  if (cause) {
    if (!isError(cause)) throw new AssertionError('cause is not an Error');

    if (!skipCauseMessage && cause.message) {
      message = message === ''
        ? cause.message
        : `${message}: ${cause.message}`;
    }
  }

  // super
  Error.call(this, message);

  /*
   * If we've been given a name, apply it now.
   */
  if (name) {
    if (!isString(name))
      throw new AssertionError('error\'s "name" must be a string');
    this.name = name;
  }

  this.message = message;

  /*
   * For debugging, we keep track of the original short message (attached
   * this Error particularly) separately from the complete message (which
   * includes the messages of our cause chain).
   */
  this.shortMessage = shortMessage;

  if (cause) {
    this.cause = cause;
  }

  /*
   * If we've been given an object with properties, shallow-copy that
   * here.  We don't want to use a deep copy in case there are non-plain
   * objects here, but we don't want to use the original object in case
   * the caller modifies it later.
   */
  this.info = {};

  if (info) {
    for (const k in info) {
      if (Object.prototype.hasOwnProperty.call(info, k)) {
        this.info[k] = info[k];
      }
    }
  }

  defineProperty(this, {
    key: META,
    value: {}
  });

  mergeMeta(this, VError.meta(this));
  mergeMeta(this, meta);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, constructorOpt || this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  return this;
}

inheritsFrom(VError, Error);

defineProperties(VError.prototype, [
  {
    key: 'toString',
    value: function toString() {
      let str =
        (Object.prototype.hasOwnProperty.call(this, 'name') && this.name) ||
        this.constructor.name ||
        this.constructor.prototype.name;

      if (this.message) {
        str += `: ${this.message}`;
      }

      return str;
    }
  },
  {
    key: 'toJSON',
    value: function toJSON() {
      const obj = {
        name: this.name,
        message: this.message,
        shortMessage: this.shortMessage,
        cause: this.cause,
        info: this.info
      };

      // Conserve keys order in obj
      for (const key in this[META]) {
        if (Object.prototype.hasOwnProperty.call(this[META], key) && !(key in obj)) {
          obj[key] = this[META][key];
        }
      }

      return obj;
    }
  }
]);

defineProperties(VError, [
  {
    key: 'cause',
    value: function cause(err) {
      if (!isError(err)) throw new AssertionError('err must be an Error');

      return isError(err.cause) ? err.cause : null;
    }
  },
  {
    key: 'info',
    value: function info(err) {
      if (!isError(err)) throw new AssertionError('err must be an Error');

      const cause = VError.cause(err);
      const rv = cause !== null ? VError.info(cause) : {};

      if (typeof err.info === 'object' && err.info !== null) {
        for (const k in err.info) {
          if (Object.prototype.hasOwnProperty.call(err.info, k)) {
            rv[k] = err.info[k];
          }
        }
      }

      return rv;
    }
  },
  {
    key: 'meta',
    value: function meta(err) {
      if (!isError(err)) throw new AssertionError('err must be an Error');

      const cause = VError.cause(err);
      const rv = cause !== null ? VError.meta(cause) : {};

      if (typeof err[META] === 'object' && err[META] !== null) {
        for (const k in err[META]) {
          if (Object.prototype.hasOwnProperty.call(err[META], k)) {
            rv[k] = err[META][k];
          }
        }
      }

      return rv;
    }
  },
  {
    key: 'findCauseByName',
    value: function findCauseByName(err, name) {
      if (!isError(err)) throw new AssertionError('err must be an Error');
      if (!isString(name)) throw new AssertionError('name (string) is required');
      if (name.length <= 0) throw new AssertionError('name cannot be empty');

      for (let cause = err; cause !== null; cause = VError.cause(cause)) {
        if (!isError(err)) throw new AssertionError('cause must be an Error');

        if (cause.name === name) {
          return cause;
        }
      }

      return null;
    }
  },
  {
    key: 'findCauseByType',
    value: function findCauseByType(err, type) {
      if (!isError(err)) throw new AssertionError('err must be an Error');
      if (!isFunc(type)) throw new AssertionError('type (func) is required');

      for (let cause = err; cause !== null; cause = VError.cause(cause)) {
        if (!isError(err)) throw new AssertionError('cause must be an Error');

        if (cause instanceof type) {
          return cause;
        }
      }

      return null;
    }
  },
  {
    key: 'hasCauseWithName',
    value: function hasCauseWithName(err, name) {
      return VError.findCauseByName(err, name) !== null;
    }
  },
  {
    key: 'hasCauseWithType',
    value: function hasCauseWithType(err, type) {
      return VError.findCauseByType(err, type) !== null;
    }
  },
  {
    key: 'fullStack',
    value: function fullStack(err) {
      if (!isError(err)) throw new AssertionError('err must be an Error');

      const cause = VError.cause(err);

      if (cause) {
        return `${err.stack}\ncaused by: ${VError.fullStack(cause)}`;
      }

      return err.stack;
    }
  },
  {
    key: 'errorFromList',
    value: function errorFromList(errors) {
      if (!Array.isArray(errors)) {
        throw new AssertionError('list of errors (array) is required');
      }

      errors.forEach(function (error) {
        if (!isObject(error)) {
          throw new AssertionError('errors ([object]) is required');
        }
      });

      if (errors.length === 0) {
        return null;
      }

      errors.forEach((e) => {
        if (!isError(e)) throw new AssertionError('error must be an Error');
      });

      if (errors.length === 1) {
        return errors[0];
      }

      return new MultiError(errors);
    }
  },
  {
    key: 'errorForEach',
    value: function errorForEach(err, func) {
      if (!isError(err)) throw new AssertionError('err must be an Error');
      if (!isFunc(func)) throw new AssertionError('func (func) is required');

      if (err instanceof MultiError) {
        err.errors.forEach((e) => {
          func(e);
        });
      } else {
        func(err);
      }
    }
  }
]);

VError.prototype.name = 'VError';

/*
 * Represents a collection of errors for the purpose of consumers that generally
 * only deal with one error.  Callers can extract the individual errors
 * contained in this object, but may also just treat it as a normal single
 * error, in which case a summary message will be printed.
 */
function MultiError(errors) {
  if (!(this instanceof MultiError)) {
    return new  MultiError(errors);
  }

  if (!Array.isArray(errors)) {
    throw new AssertionError('list of errors (array) is required');
  }
  if (errors.length <= 0) {
    throw new AssertionError('must be at least one error is required');
  }

  // super
  return VError.call(
    this,
    {
      cause: errors[0],
      meta: {
        errors: [...errors]
      }
    },
    'first of %d error%s',
    errors.length,
    errors.length === 1 ? '' : 's'
  );
}

inheritsFrom(MultiError, VError);

MultiError.prototype.name = 'MultiError';

/*
 * See README.md for reference details.
 */
function WError(...args) {
  if (!(this instanceof WError)) {
    return new WError(...args);
  }

  const { options, shortMessage } = parseConstructorArguments(...args);

  options.skipCauseMessage = true;

  // super
  return VError.call(
    this,
    options,
    '%s',
    shortMessage
  );
}

inheritsFrom(WError, VError);

defineProperties(WError.prototype, [
  {
    key: 'toString',
    value: function toString() {
      let str =
        (Object.prototype.hasOwnProperty.call(this, 'name') && this.name) ||
        this.constructor.name ||
        this.constructor.prototype.name;

      if (this.message) {
        str += `: ${this.message}`;
      }
      if (this.cause && this.cause.message) {
        str += `; caused by ${this.cause.toString()}`;
      }

      return str;
    }
  }
]);

WError.prototype.name = 'WError';

VError.VError = VError;
VError.WError = WError;
VError.MultiError = MultiError;

VError.META = META;

export default VError;

/*
 * Usage:
 *
 * import VError from '@openagenda/verror';     // VError.cause ✓
 * import { VError } from '@openagenda/verror'; // VError.cause ✓
 * import * as VError from '@openagenda/verror' // VError.cause ✓
 * import { cause } from '@openagenda/verror';  // cause        ✓
 */
