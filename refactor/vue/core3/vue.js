import { EventBus, on, emit } from './eventBus.js';
import { mount, render } from './mountComponent.js';
import { updateSlots, compileTemplate, parseComponents } from './compileTemplate.js';
import { proxyData, reactive } from './proxyData.js';
import { watch, computed } from './watchComputed.js';
import { getCurrentInstance, setCurrentInstance } from './instance.js';
import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated } from './lifecycle.js';

function Vue(options) {
  this.constructor = Vue;
  this.$options = options;
  this._eventBus = new EventBus();

  this.$on = on;
  this.$emit = emit;
  this._mount = mount;
  this._render = render;
  this._proxyData = proxyData;
  this._updateSlots = updateSlots;
  this._compileTemplate = compileTemplate;
  this._parseComponents = parseComponents;

  setCurrentInstance(this);
  this._data = typeof options.setup === 'function' ? options.setup() : {};
  this._components = options.components ?? {};

  this._proxyData();
  this.$ready = this._mount();
}

const createApp = (options) => new Vue(options);

export {
  createApp,
  reactive,
  computed,
  watch,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated
};
