import { EventBus, on, emit } from './eventBus.js';
import { mount, render } from './mountComponent.js';
import { updateSlots, compileTemplate, parseComponents } from './compileTemplate.js';

import { proxyData } from './proxyData2.js';
import { watch, computed } from './watchComputed2.js';

function Vue(options) {
  this.constructor = Vue;
  this.$options = options;
  this._eventBus = new EventBus();

  this.$on = on;
  this.$emit = emit;
  this._mount = mount;
  this._render = render;
  this._proxyData = proxyData;
  this._createWatchers = watch;
  this._createComputed = computed;
  this._updateSlots = updateSlots;
  this._compileTemplate = compileTemplate;
  this._parseComponents = parseComponents;

  this._data = typeof options.data === 'function' ? options.data() : options.data;
  this._components = options.components ?? {};

  this._proxyData();
  this._createWatchers();
  this._createComputed();
  this.$ready = this._mount();
}

export default Vue;
