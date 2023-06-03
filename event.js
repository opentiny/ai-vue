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
  this._data = typeof options.data === 'function' ? options.data() : options.data;
  this._methods = options.methods;
  this._eventBus = new EventBus();

  this._proxyData();
  this._proxyMethods();
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

Vue.prototype._proxyMethods = function() {
  var self = this;
  var methods = this._methods;
  if (methods) {
    Object.keys(methods).forEach(function(key) {
      self[key] = methods[key].bind(self);
    });
  }
};

Vue.prototype.$emit = function(eventName, payload) {
  this._eventBus.emit(eventName, payload);
};

Vue.prototype.$on = function(eventName, callback) {
  this._eventBus.on(eventName, callback);
};

// 使用示例
var app = new Vue({
  data: {
    message: 'Hello, Vue!'
  },
  methods: {
    greet: function() {
      this.$emit('greet', this.message);
    },
    updateMessage: function(newMessage) {
      this.message = newMessage;
    }
  },
});

app.$on('greet', function(message) {
  console.log('Greet:', message);
});

app.greet(); // Output: Greet: Hello, Vue!
app.updateMessage('Hello, World!');
app.greet(); // Output: Greet: Hello, World!
