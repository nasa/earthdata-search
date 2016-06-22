var extend = require('./extend'),
    eventsKey = '_edsc_listeners';

module.exports = {
  on: function(events, fn, context) {
    var listeners = this[eventsKey] = this[eventsKey] || {},
        i, len, event;
    events = events.split(' ');
    for (i = 0, len = events.length; i < len; i++) {
      event = events[i];
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push([fn, context || this]);
    }
    return this;
  },

  off: function(events, fn, context) {
    var listeners = this[eventsKey],
        i, j, len, eventListeners, listener;
    if (!listeners) {
      return this;
    }

    events = events.split(' ');
    for (i = 0, len = events.length; i < len; i++) {
      eventListeners = listeners[events[i]];
      if (eventListeners) {
        j = 0;
        while (j < eventListeners.length) {
          listener = eventListeners[j];
          if (listener[0] == fn && (!context || listener[1] == context)) {
            listeners.splice(j, 1);
          }
          else {
            j++;
          }
        }
        if (eventListeners.length == 0) {
          delete listeners[events[i]];
        }
      }
    }
    return this;
  },

  fire: function(event, data) {
    // console.log(event, JSON.stringify(data));
    var listeners = this[eventsKey],
        toFire = listeners && listeners[event],
        e, i, len, listener;
    if (toFire) {
      e = extend({}, (data || {}), {type: event, target: this});
      for (i = 0, len = toFire.length; i < len; i++) {
        listener = toFire[i];
        listener[0].call(listener[1], e);
      }
    }
    return this;
  }
};
