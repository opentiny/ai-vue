import { setCurrentInstance } from './instance.js';

const render = function() {
  this._compileTemplate();
  this._parseComponents();
};

const mount = async function() {
  if (typeof this.$options.beforeMount === 'function') {
    setCurrentInstance(this);
    await this.$options.beforeMount.call(this);
  }

  this._render();

  if (typeof this.$options.mounted === 'function') {
    setCurrentInstance(this);
    await this.$options.mounted.call(this);
  }
};

export { render, mount };
