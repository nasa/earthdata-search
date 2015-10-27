/**
 * Merge destination objects into source objects
 */
module.exports = function (dest) {
  var length = arguments.length, i, source, key;
  if (length < 2 || dest == null) return dest;
  for (i = 1; i < length; i++) {
    source = arguments[i];
    for (key in source) {
      dest[key] = source[key];
    }
  }
  return dest;
};
