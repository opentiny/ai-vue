const proxyData = function () {
  const self = this;

  Object.keys(this._data).forEach((key) => {
    Object.defineProperty(self, key, {
      get: () => self._data[key],
      set(newValue) {
        if (typeof self.$options.beforeUpdate === 'function') {
          self.$options.beforeUpdate.call(self);
        }

        self._data[key] = newValue;
        self._render();

        if (typeof self.$options.updated === 'function') {
          self.$options.updated.call(self);
        }
      }
    });
  });

  const methods = this.$options.methods ?? {};
  Object.keys(methods).forEach((key) => (self[key] = methods[key].bind(self)));
};

export { proxyData };
