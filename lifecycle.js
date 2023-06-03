function Vue(options) {
  this.$options = options;

  if (typeof options.beforeCreate === 'function') {
    options.beforeCreate.call(this);
  }

  this._data = typeof options.data === 'function' ? options.data() : options.data;

  this._proxyData();

  if (typeof options.created === 'function') {
    options.created.call(this);
  }

  this.$mount(options.el);
}

Vue.prototype.$mount = function(el) {
  this.$el = document.querySelector(el);

  if (typeof this.$options.beforeMount === 'function') {
    this.$options.beforeMount.call(this);
  }

  this.render();

  if (typeof this.$options.mounted === 'function') {
    this.$options.mounted.call(this);
  }
};

Vue.prototype._proxyData = function() {
  var self = this;
  Object.keys(this._data).forEach(function(key) {
    Object.defineProperty(self, key, {
      get: function() {
        return self._data[key];
      },
      set: function(newValue) {
        self._data[key] = newValue;
        if (typeof self.$options.beforeUpdate === 'function') {
          self.$options.beforeUpdate.call(self);
        }
        self.render();
        if (typeof self.$options.updated === 'function') {
          self.$options.updated.call(self);
        }
      }
    });
  });
};

Vue.prototype.render = function() {
  if (typeof this.$options.render === 'function') {
    this.$el.innerHTML = this.$options.render.call(this);
  }
};

// 使用示例
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello, Vue!'
  },
  beforeCreate: function() {
    console.log('beforeCreate hook');
  },
  created: function() {
    console.log('created hook');
  },
  beforeMount: function() {
    console.log('beforeMount hook');
  },
  mounted: function() {
    console.log('mounted hook');
  },
  beforeUpdate: function() {
    console.log('beforeUpdate hook');
  },
  updated: function() {
    console.log('updated hook');
  },
  render: function() {
    return '<p>' + this.message + '</p>';
  }
});
