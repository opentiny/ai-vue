const watch = function () {
  const self = this;
  const callbacks = self.$options.watch || {};

  Object.keys(callbacks).forEach((key) => {
    const callback = callbacks[key];
    let value = self._data[key];

    Object.defineProperty(self._data, key, {
      get: () => value,
      set(newValue) {
        const oldValue = value;
        value = newValue;
        callback.call(self, newValue, oldValue);
      }
    });
  });
};

const computed = function () {
  const self = this;
  const callbacks = self.$options.computed || {};

  Object.keys(callbacks).forEach((key) => {
    Object.defineProperty(self, key, {
      get: () => callbacks[key].call(self)
    });
  });
};

export { watch, computed };
