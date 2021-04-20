export default function getInstance(_this, ctor, args) {
  if (_this instanceof ctor) {
    return _this;
  }

  // Equivalent to `new ctor(...args)` without polluting stackTrace
  const obj = Object.create(ctor.prototype);
  ctor.apply(obj, args);
  return obj;
}
