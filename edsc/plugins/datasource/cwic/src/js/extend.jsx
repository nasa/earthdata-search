// Code required to cleanly extend a Coffeescript class

export default function(child, parent) {
  for (var key in parent) {
    if ({}.hasOwnProperty.call(parent, key))
      child[key] = parent[key];
  }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  return child;
};
