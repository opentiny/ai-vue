const watch = function() {
  const self = this;
  const watch = this.$options.watch || {};

  Object.keys(watch).forEach((key) => {
    const callback = watch[key];
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

const computed = function() {
  const self = this;
  const computed = this.$options.computed ?? {};

  Object.keys(computed).forEach((key) => {
    Object.defineProperty(self, key, {
      get: () => computed[key].call(self)
    });
  });
};

export { watch, computed };
