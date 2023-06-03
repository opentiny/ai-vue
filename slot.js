function Vue(options) {
  this.$options = options;
  this._data = typeof options.data === 'function' ? options.data() : options.data;
  this._components = options.components || {};

  this._proxyData();
  this._compileTemplate();
  this._proxyComponents();
}

Vue.prototype._proxyData = function() {
  var self = this;
  Object.keys(this._data).forEach(function(key) {
    Object.defineProperty(self, key, {
      get: function() {
        return self._data[key];
      },
      set: function(newValue) {
        self._data[key] = newValue;
      }
    });
  });
};

Vue.prototype._compileTemplate = function() {
  var self = this;
  var el = this.$options.el
  var template = this.$options.template || '';

  var evalExpression = function(expression) {
    with (self) return eval(expression);
  }

  var compiledTemplate = template.replace(/\{\{(.*?)\}\}/g, function(match, expression) {
    var value = evalExpression(expression);
    return value !== undefined ? value : '';
  });

  var element = el ? document.querySelector(el) : document.createElement('div');
  element.innerHTML = compiledTemplate.trim();
  this.$el = el ? element : element.childNodes[0];
};

Vue.prototype._proxyComponents = function() {
  var self = this;
  var components = this._components;

  Object.keys(components).forEach(function(componentName) {
    var component = new Vue(components[componentName]);
    self.$el.querySelectorAll(componentName).forEach(function(element) {
      component.$el.querySelectorAll('slot').forEach(function(slot) {
        slot.innerHTML = element.innerHTML;
      });
      element.innerHTML = component.$el.outerHTML;
    });
  });
};

// 使用示例
var HelloComponent = {
  data: function() {
    return {
      name: 'John'
    };
  },
  template: `
    <div>
      <h1>{{ name }}</h1>
      <slot></slot>
    </div>
  `
};

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello, Vue!'
  },
  components: {
    HelloComponent
  },
  template: `
    <HelloComponent>
      <p>{{ message }}</p>
    </HelloComponent>
  `
});
