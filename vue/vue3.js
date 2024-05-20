import { EventBus, on, emit } from './eventBus.js';
import { mount, render } from './mountComponent.js';
import { updateSlots, compileTemplate, parseComponents } from './compileTemplate.js';

import { proxyData, reactive } from './proxyData3.js';
import { watch, computed } from './watchComputed3.js';

import { getCurrentInstance, setCurrentInstance } from './instance.js';
import { onBeforeUnmount, onMounted, onBeforeUpdate, onUpdated } from './lifecycle.js';

function Vue(options) {
  this.constructor = Vue;
  this.$options = options;
  this._eventBus = new EventBus();

  const self = this;
  const context = {
    emit(eventName, ...payload) {
      setCurrentInstance(self);
      self._eventBus.emit(self, eventName, payload);
    }
  };

  setCurrentInstance(self);
  this._data = typeof options.setup === 'function' ? options.setup({}, context) : {};
  this._components = options.components ?? {};

  this._proxyData();
  this._mount();
}

Vue.prototype.$on = on;
Vue.prototype.$emit = emit;

Vue.prototype._mount = mount;
Vue.prototype._render = render;
Vue.prototype._proxyData = proxyData;
Vue.prototype._updateSlots = updateSlots;
Vue.prototype._compileTemplate = compileTemplate;
Vue.prototype._parseComponents = parseComponents;

const createApp = (options) => new Vue(options);

export { createApp, reactive, computed, watch, getCurrentInstance, onBeforeUnmount, onMounted, onBeforeUpdate, onUpdated };
