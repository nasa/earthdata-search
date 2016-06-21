module.exports = function(pkg, value) {
  var components = pkg.split('.'),
      i, len, parent = window;
  for (i = 0, len = components.length; i < len - 1; i++) {
    parent = parent[components[i]] = parent[components[i]] || {};
  }
  parent[components[components.length - 1]] = value;
};
