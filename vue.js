function EventBus() {
  this._events = {};
}

EventBus.prototype.on = function(eventName, callback) {
  if (!this._events[eventName]) {
    this._events[eventName] = [];
  }
  this._events[eventName].push(callback);
};

EventBus.prototype.emit = function(eventName, payload) {
  if (this._events[eventName]) {
    this._events[eventName].forEach(function(callback) {
      callback(payload);
    });
  }
};

function Vue(options) {
  this.$options = options;

  if (typeof options.beforeCreate === 'function') {
    options.beforeCreate.call(this);
  }

  this._data = typeof options.data === 'function' ? options.data() : options.data;
  this._eventBus = new EventBus();
  this._proxyData();
  this._proxyMethods();
  this._createComputed();
  this._createWatchers();

  if (typeof options.created === 'function') {
    options.created.call(this);
  }

  this.$mount();
}

Vue.prototype.$render = function() {
  if (typeof this.$options.render === 'function' && this.$options.el) {
    this.$el = document.querySelector(this.$options.el);
    this.$el.innerHTML = this.$options.render.call(this);
  } else {
    this._compileTemplate();
    this._proxyComponents();
  }
};

Vue.prototype.$mount = function() {
  if (typeof this.$options.beforeMount === 'function') {
    this.$options.beforeMount.call(this);
  }

  this.$render();

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

        self.$render();

        if (typeof self.$options.updated === 'function') {
          self.$options.updated.call(self);
        }
      }
    });
  });
};

Vue.prototype._createComputed = function() {
  var self = this;
  var computed = this.$options.computed || {};

  Object.keys(computed).forEach(function(key) {
    Object.defineProperty(self, key, {
      get: function() {
        return computed[key].call(self);
      }
    });
  });
};

Vue.prototype._createWatchers = function() {
  var self = this;
  var watch = this.$options.watch || {};

  Object.keys(watch).forEach(function(key) {
    var callback = watch[key]
    var value = self._data[key];

    Object.defineProperty(self._data, key, {
      get: function() {
        return value;
      },
      set: function(newValue) {
        var oldValue = value
        value = newValue;
        callback.call(self, newValue, oldValue);
      }
    });
  });
};

Vue.prototype._proxyMethods = function() {
  var self = this;
  var methods = this.$options.methods || {};
  Object.keys(methods).forEach(function(key) {
    self[key] = methods[key].bind(self);
  });
};

Vue.prototype.$emit = function(eventName, payload) {
  this._eventBus.emit(eventName, payload);
};

Vue.prototype.$on = function(eventName, callback) {
  this._eventBus.on(eventName, callback);
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
  this._handleDirective()
};

Vue.prototype._handleDirective = function() {
  var self = this;

  this.$el.querySelectorAll('[v-model]').forEach(function(element) {
    var value = element.getAttribute('v-model');
    element.value = self._data[value];
    element.addEventListener('input', function(event) {
      self._data[value] = event.target.value;
      self.$emit(`update:${value}`, event.target.value);
    });
  });

  this.$el.querySelectorAll('[v-text]').forEach(function(element) {
    var value = element.getAttribute('v-text');
    element.textContent = self._data[value];
    self.$on(`update:${value}`, function(newValue) {
      element.textContent = newValue;
    });
  });
};

Vue.prototype._proxyComponents = function() {
  var self = this;
  var components = this.$options.components || {};

  Object.keys(components).forEach(function(componentName) {
    var component = self[componentName] || new Vue(components[componentName]);
    var isNewComponent = typeof self[componentName] === 'undefined';
    self[componentName] = component;

    self.$el.querySelectorAll(componentName).forEach(function(element) {
      component.$el.querySelectorAll('slot').forEach(function(slot) {
        slot.innerHTML = element.innerHTML;
      });
      element.innerHTML = component.$el.outerHTML;

      isNewComponent && component.$options?.emits.forEach(function(event) {
        var method = element.getAttribute('v-on:' + event);
        if (typeof self[method] === 'function') {
          component.$on(event, self[method]);
        }
      });
    });
  });
};


// 使用示例
var HelloComponent = {
  emits: ['greet'],
  data: function() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    };
  },
  computed: {
    fullName: function() {
      return this.firstName + ' ' + this.lastName;
    }
  },
  updated: function() {
    this.$emit('greet', this.firstName);
  },
  template: `
    <div>
      <h1>{{ fullName }}</h1>
      <slot></slot>
    </div>
  `
};

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello, Vue!',
    inputValue: 'ChatGPT'
  },
  watch: {
    message: function(newValue, oldValue) {
      console.log('Message changed:', oldValue, ' -> ', newValue);
    },
    inputValue: function(newValue, oldValue) {
      console.log('InputValue changed:', oldValue, ' -> ', newValue);
    }
  },
  methods: {
    greetMessage: function(message) {
      this.$emit('greet', message);
    },
    updateMessage: function(newMessage) {
      this.message = newMessage;
    }
  },
  components: {
    HelloComponent
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
  template: `
    <div>
      <HelloComponent v-on:greet="greetMessage">
        <p>{{ message }}</p>
      </HelloComponent>
      <input v-model="inputValue" type="text">
      <p v-text="inputValue"></p>
    </div>
  `
});

app.$on('greet', function(message) {
  console.log('Greet:', message);
});

app.inputValue = 'OpenAI'
app.HelloComponent.firstName = 'Tom';
app.updateMessage('Hello, World!');
