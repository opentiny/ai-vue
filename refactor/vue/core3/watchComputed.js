import { getCurrentInstance } from './instance.js';

const watch = (source, callback) => {
  const instance = getCurrentInstance();
  instance._watchCallback = callback;
  source();
  instance._watchCallback = null;
};

const computed = (callback) => {
  const instance = getCurrentInstance();
  return {
    instance,
    callback,
    toString: () => callback()
  };
};

export { watch, computed };
