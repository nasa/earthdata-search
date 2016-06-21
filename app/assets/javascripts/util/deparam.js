this.edsc.util.deparam = (function(undefined) {
  var defaultReviver = function(key, value) {
    var specials = {
      'true': true,
      'false': false,
      'null': null,
      'undefined': undefined
    };

    return (+value + '') === value ? +value // Number
      : value in specials ? specials[value] // true, false, null, undefined
      : value; // String
  };

  var decode = function(text) {
    return decodeURIComponent(text);
  };

  var deparam = function(text, reviver) {
    var kv, key, value, keys, i, j, current, next,
        result = {},
        pairs = text.replace(/\+/g, ' ').split('&');

    reviver = reviver || defaultReviver;

    for (i = 0; i < pairs.length; i++) {
      kv = pairs[i].split('=');
      key = decode(kv[0]);
      if (!key) { continue; }

      value = reviver(key, decode(kv[1] || ''));

      // If the key has balanced square-bracket expressions
      if (/^[^\[\]]+(?:\[[^\]]*\])+$/.test(key)) {
        // Split on brackets
        keys = key.split(/(?:\]?\[|\]$)/);
        keys.pop();

        current = result;
        for (j = 0; j < keys.length; j++) {
          key = keys[j] === '' ? current.length : keys[j];
          if (j === keys.length - 1) {
            next = value;
          }
          else {
            next = current[key] || (isNaN(keys[j + 1]) ? {} : []);
          }
          current = current[key] = next;
        }
      }
      else if (Array.isArray(result[key])) {
        result[key].push(value);
      }
      else if (key in result) {
        result[key] = [result[key], value];
      }
      else {
        result[key] = value;
      }
    }

    return result;
  };

  deparam.reviver = defaultReviver;

  return deparam;
}());
