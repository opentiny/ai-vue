function Vue(options) {
  this._data = options.data;
  this._computed = options.computed;
  this._watch = options.watch;

  this._proxyData();
  this._createComputed();
  this._createWatchers();
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

Vue.prototype._createComputed = function() {
  var self = this;
  var computed = this._computed || {};

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
  var watch = this._watch || {};

  Object.keys(watch).forEach(function(key) {
    var callback = watch[key]
    var value = self._data[key];

    Object.defineProperty(self._data, key, {
      get: function() {
        return value;
      },
      set: function(newValue) {
        value = newValue;
        callback.call(self, newValue);
      }
    });
  });
};

// 使用示例
var app = new Vue({
  data: {
    message: 'Hello, Vue!',
    firstName: 'John',
    lastName: 'Doe'
  },
  computed: {
    fullName: function() {
      return this.firstName + ' ' + this.lastName;
    }
  },
  watch: {
    message: function(newValue) {
      console.log('Message changed:', newValue);
    }
  }
});

console.log(app.message);       // Output: Hello, Vue!
app.message = 'Hello, Vue.js!'; // Output: Message changed: Hello, Vue.js!
console.log(app.message);       // Output: Hello, Vue.js!
console.log(app.fullName);      // Output: John Doe
app.message = 'New message';    // Output: Message changed: New message
