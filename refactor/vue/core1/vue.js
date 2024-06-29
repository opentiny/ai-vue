import { EventBus, on, emit } from './eventBus.js';
import { mount, render } from './mountComponent.js';
import { compileTemplate } from './compileTemplate.js';
import { proxyData, reactive } from './proxyData.js';
import { computed } from './watchComputed.js';
import { setCurrentInstance } from './instance.js';

function Vue(options) {
  this.$options = options;
  this._eventBus = new EventBus();

  this.$on = on;
  this.$emit = emit;
  this._mount = mount;
  this._render = render;
  this._proxyData = proxyData;
  this._compileTemplate = compileTemplate;

  setCurrentInstance(this);
  this._data = typeof options.setup === 'function' ? options.setup() : {};

  this._proxyData();
  this._mount();
}

const createApp = (options) => new Vue(options);

export { createApp, reactive, computed };
