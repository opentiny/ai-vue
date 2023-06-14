var instance = null;

function EventBus() {
  this._events = {};
}

EventBus.prototype.on = function(eventObject, eventName, callback) {
  if (!this._events[eventObject]) {
    this._events[eventObject] = {};
  }
  if (!this._events[eventObject][eventName]) {
    this._events[eventObject][eventName] = [];
  }
  this._events[eventObject][eventName].push(callback);
};

EventBus.prototype.emit = function(eventObject, eventName, payload) {
  if (this._events[eventObject] && this._events[eventObject][eventName]) {
    this._events[eventObject][eventName].forEach(function(callback) {
      callback(payload);
    });
  }
};

function Vue(options) {
  instance = this;
  this.$options = options;
  this._eventBus = new EventBus();

  var context = {
    emit: function(eventName, payload) {
      instance._eventBus.emit(instance, eventName, payload);
    }
  };

  this._data = typeof options.setup === 'function' ? options.setup({}, context) : {};
  this._proxyData();
}

Vue.prototype._proxyData = function() {
  var self = this;
  Object.keys(this._data).forEach(function(key) {
    Object.defineProperty(self, key, {
      get: function() {
        var value = self._data[key];
        return value?.instance === self ? value.callback() : value;
      },
      set: function(newValue) {
        if (self._data[key]?.instance !== self) {
          self._data[key] = newValue;
        }
      }
    });
  });
};

Vue.prototype.$on = function(eventName, callback) {
  this._eventBus.on(this, eventName, callback);
};

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      if (typeof instance._watchCallback === 'function') {
        instance._eventBus.on(target, key, instance._watchCallback);
      }
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      instance._eventBus.emit(target, key, value);
    }
  });
}

function computed(callback) {
  return {
    instance,
    callback
  }
}

function watch(source, callback) {
  instance._watchCallback = callback;
  source();
  instance._watchCallback = null;
}

// 使用示例
var app = new Vue({
  setup: function(props, context) {
    const state = reactive({
      message: 'Hello, Vue!',
      firstName: 'John',
      lastName: 'Doe'
    });

    const fullName = computed(function() {
      return state.firstName + ' ' + state.lastName;
    });

    watch(function() {
      return state.message;
    }, function(newValue) {
      console.log('Message changed:', newValue);
    });

    const greet = function() {
      context.emit('greet', state.message);
    }

    return {
      state,
      fullName,
      greet
    }
  }
});

console.log(app.state.message);       // Output: Hello, Vue!
app.state.message = 'Hello, Vue.js!'; // Output: Message changed: Hello, Vue.js!
console.log(app.state.message);       // Output: Hello, Vue.js!
console.log(app.fullName);            // Output: John Doe
app.state.message = 'New message';    // Output: Message changed: New message

app.$on('greet', function(message) {
  console.log('Greet:', message);
});

app.greet(); // Output: Greet: New message!
