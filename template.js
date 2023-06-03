function Vue(options) {
  this.$options = options;
  this._data = typeof options.data === 'function' ? options.data() : options.data;
  this._compileTemplate();
}

Vue.prototype._compileTemplate = function() {
  var self = this;
  var template = this.$options.template || '';

  var evalExpression = function(expression) {
    with (self._data) return eval(expression);
  }

  var compiledTemplate = template.replace(/\{\{(.*?)\}\}/g, function(match, expression) {
    var value = evalExpression(expression);
    return value !== undefined ? value : '';
  });

  var element = document.querySelector(this.$options.el);
  element.innerHTML = compiledTemplate.trim();

  element.querySelectorAll('[v-model]').forEach(function(element) {
    var value = element.getAttribute('v-model');
    element.value = self._data[value];
    element.addEventListener('input', function(event) {
      self._data[value] = event.target.value;
    });
  });

  element.querySelectorAll('[v-text]').forEach(function(element) {
    var value = element.getAttribute('v-text');
    element.textContent = self._data[value];
  });
};

// 使用示例
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello, Vue!',
    inputValue: 'ChatGPT'
  },
  template: `
    <div>
      <p>{{ message }}</p>
      <input v-model="inputValue" type="text">
      <p v-text="inputValue"></p>
    </div>
  `
});