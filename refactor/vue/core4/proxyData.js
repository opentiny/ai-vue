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
      const instance = getCurrentInstance();
      if (typeof instance._watchCallback === 'function') {
        instance._eventBus.on(target, key, instance._watchCallback);
      }
      return target[key];
    },
    set(target, key, value) {
      const instance = getCurrentInstance();

      if (typeof instance.$options.beforeUpdate === 'function') {
        instance.$options.beforeUpdate.call(instance);
      }

      const oldValue = target[key];
      target[key] = value;

      instance._eventBus.emit(target, key, [value, oldValue]);
      instance._render();

      if (typeof instance.$options.updated === 'function') {
        instance.$options.updated.call(instance);
      }

      return true;
    }
  });

export { proxyData, reactive };
