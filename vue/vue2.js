import { EventBus, on, emit } from './eventBus.js';
import { mount, render } from './mountComponent.js';
import { updateSlots, compileTemplate, parseComponents } from './compileTemplate.js';

import { proxyData } from './proxyData2.js';
import { watch, computed } from './watchComputed2.js';

function Vue(options) {
  this.constructor = Vue;
  this.$options = options;
  this._eventBus = new EventBus();

  this._data = typeof options.data === 'function' ? options.data() : options.data;
  this._components = options.components ?? {};

  this._proxyData();
  this._createWatchers();
  this._createComputed();
  this._mount();
}

Vue.prototype.$on = on;
Vue.prototype.$emit = emit;

Vue.prototype._mount = mount;
Vue.prototype._render = render;
Vue.prototype._proxyData = proxyData;
Vue.prototype._createWatchers = watch;
Vue.prototype._createComputed = computed;
Vue.prototype._updateSlots = updateSlots;
Vue.prototype._compileTemplate = compileTemplate;
Vue.prototype._parseComponents = parseComponents;

export default Vue;
