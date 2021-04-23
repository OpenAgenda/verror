export function defineProperty(target, descriptor) {
  descriptor.enumerable = descriptor.enumerable || false;
  descriptor.configurable = true;
  if ('value' in descriptor) descriptor.writable = true;
  Object.defineProperty(target, descriptor.key, descriptor);
}

export function defineProperties(target, props) {
  for (let i = 0; i < props.length; i++) {
    defineProperty(target, props[i]);
  }
}

export function inheritsFrom(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
  Child.__proto__ = Parent;
}

export function getInstance(that, ctor, args) {
  if (that instanceof ctor) {
    return that;
  }

  // Equivalent to `new ctor(...args)` without polluting stackTrace
  const obj = Object.create(ctor.prototype);
  ctor.apply(obj, args);
  return obj;
}