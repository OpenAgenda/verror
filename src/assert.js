export function isError(arg) {
  return Object.prototype.toString.call(arg) === '[object Error]' || arg instanceof Error;
}

export function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

export function isString(arg) {
  return typeof arg === 'string';
}

export function isFunc(arg) {
  return typeof arg === 'function';
}
