var instance = null;

function Vue(options) {
  instance = this;
  this.$options = options;
  this._data = typeof options.setup === 'function' ? options.setup() : {};
  this._proxyData();
  this.$mount(options.el);
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

Vue.prototype.render = function() {
  if (typeof this.$options.render === 'function') {
    this.$el.innerHTML = this.$options.render.call(this._data);
  }
};

function onBeforeUnmount(callback) {
  instance.$options.beforeMount = callback;
}

function onMounted(callback) {
  instance.$options.mounted = callback;
}

function onBeforeUpdate(callback) {
  instance.$options.beforeUpdate = callback;
}

function onUpdated(callback) {
  instance.$options.updated = callback;
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      if (typeof instance.$options.beforeUpdate === 'function') {
        instance.$options.beforeUpdate.call(instance);
      }
      instance.render();
      if (typeof instance.$options.updated === 'function') {
        instance.$options.updated.call(instance);
      }
    }
  });
}

// 使用示例
var app = new Vue({
  el: '#app',
  setup: function() {
    const state = reactive({
      message: 'Hello, Vue!'
    });

    onBeforeUnmount(function() {
      console.log('beforeMount hook');
    });

    onMounted(function() {
      console.log('mounted hook');
    });

    onBeforeUpdate(function() {
      console.log('beforeUpdate hook');
    });

    onUpdated(function() {
      console.log('updated hook');
    });

    return {
      state
    }
  },
  render: function() {
    return '<p>' + this.state.message + '</p>';
  }
});
