import { setCurrentInstance, getCurrentInstance } from './instance.js';

const proxyData = function () {
  const self = this;

  Object.keys(this._data).forEach((key) => {
    Object.defineProperty(self, key, {
      get() {
        const value = self._data[key];
        setCurrentInstance(self);
        return value?.instance === self ? value.callback() : value;
      },
      set(newValue) {
        if (self._data[key]?.instance !== self) {
          self._data[key] = newValue;
        }
      }
    });
  });
};

const reactive = (obj) =>
  new Proxy(obj, {
    get(target, key) {
      return target[key];
    },
    set(target, key, value) {
      const instance = getCurrentInstance();
      const oldValue = target[key];

      target[key] = value;

      instance._eventBus.emit(target, key, [value, oldValue]);
      instance._render();

      return true;
    }
  });

export { proxyData, reactive };
