export function arrayWrap(obj) {
  if (obj == null) return [];
  return Array === obj.constructor ? obj : [obj];
}

export function serializeObj(obj) {
  var stringified = JSON.stringify(obj, null, '  ').split(/\n/);
  var lines = [];
  for (var i = 0; i < stringified.length; i ++) {
    var tmp = stringified[i].replace(/\s*[\{\}\[\]],?/, '');
    if(tmp) {
      tmp = tmp.replace(/\s{2}/,'');
      tmp = tmp.replace(/\"/, '');
      tmp = tmp.replace(/\"\:\s*\"/,': ');
      tmp = tmp.replace(/\",?\s*/, '');
      tmp = tmp.charAt(0).toUpperCase() + tmp.slice(1);
      lines.push(tmp);
    }
  }

  return lines.join("\n");
}
