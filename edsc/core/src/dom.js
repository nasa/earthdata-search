var defined = function(val) {
  return typeof(val) !== 'undefined';
};

module.exports = {
  remove: function(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  },
  stringToNodes: function(str) {
    var fragment = document.createDocumentFragment(),
        div = document.createElement('DIV');
    fragment.appendChild(div);
    div.innerHTML = str;
    return div.children;
  },
  stringToNode: function(str) {
    return this.stringToNodes(str)[0];
  },
  addClass: function(el, name) {
    var classes;
    if (defined(el.classList)) {
      el.classList.add(name);
    }
    else if (!this.hasClass(el, name)) {
      classes = this.getClasses(el);
      classes.push(name);
      this.setClasses(el, classes);
    }
  },
  removeClass: function(el, name) {
    var classes, index;
    if (defined(el.classList)) {
      el.classList.remove(name);
    }
    else {
      classes = this.getClasses(el);
      index = classes.indexOf(name);
      if (index !== -1) {
        classes.splice(index, 1);
        this.setClasses(el, classes);
      }
    }
  },
  toggleClass: function(el, name, show) {
    if (!defined(show)) {
      show = !this.hasClass(el, name);
    }
    if (show) {
      this.removeClass(el, name);
    }
    else {
      this.addClass(el, name);
    }
  },
  setClasses: function(el, classes) {
    el.className = classes.join(' ');
  },
  getClasses: function(el) {
    var result = [], className = el.className;
    if (defined(el.classList)) {
      result = Array.prototype.slice.call(el.classList, 0);
    }
    else if (className && className.length > 0) {
      result = className.split(' ');
    }
    return result;
  },
  hasClass: function(el, name) {
    if (defined(el.classList)) {
      return el.classList.contains(name);
    }
    else {
      return this.getClasses(el).indexOf(name) !== -1;
    }
  },
  getStyle: function(node, style) {
    return window.getComputedStyle(node, null).getPropertyValue(style);
  },
  setStyles: function(node, styleObj) {
    var key, style = node.style;
    for (key in styleObj) {
      style[key] = styleObj[key];
    }
  },
  scrollParent: function(el) {
    var overflowX, overflowY;
    while (el instanceof HTMLElement) {
      overflowX = this.getStyle(el, 'overflow-y');
      overflowY = this.getStyle(el, 'overflow-x');
      if (overflowX === 'auto' || overflowX === 'scroll' ||
          overflowY === 'auto' || overflowY === 'scroll') {
        return el;
      }
      el = el.parentNode;
    }
    return null;
  }
};
