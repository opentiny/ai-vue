function EventBus() {
  this._events = {};
}

EventBus.prototype.on = function(eventObject, eventName, callback) {
  let eventObj = this._events[eventObject];

  if (!eventObj) {
    eventObj = {};
    this._events[eventObject] = eventObj;
  }

  if (!eventObj[eventName]) {
    eventObj[eventName] = [];
  }

  eventObj[eventName].push(callback);
};

EventBus.prototype.emit = function(eventObject, eventName, payload) {
  const eventObj = this._events[eventObject];

  if (eventObj && eventObj[eventName]) {
    eventObj[eventName].forEach((callback) => callback.apply(null, payload));
  }
};

const on = function(eventName, callback) {
  this._eventBus.on(this, eventName, callback);
};

const emit = function(eventName, ...payload) {
  this._eventBus.emit(this, eventName, payload);
};

export { EventBus, on, emit };
