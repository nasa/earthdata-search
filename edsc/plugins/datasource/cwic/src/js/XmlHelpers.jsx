import * as CwicUtils from './CwicUtils.jsx';

export function elToObj(el) {
  let result;

  let hasChildren = false;
  let childEl = el.firstChild;
  while (childEl) {
    if (childEl.nodeType == Node.ELEMENT_NODE) {
      hasChildren = true;
      break;
    }
    childEl = childEl.nextSibling;
  }

  if (hasChildren) {
    result = {};
    let child = el.firstChild;
    while (child) {
      if (child.nodeType == Node.ELEMENT_NODE) {
        let prop = child.tagName.replace(/^.*:/g, '');
        let obj = elToObj(child);
        if (result.hasOwnProperty(prop)) {
          result[prop] = CwicUtils.arrayWrap(result[prop]);
          result[prop].push(obj);
        }
        else {
          result[prop] = obj;
        }
      }
      child = child.nextSibling;
    }
  }
  else if (el.attributes.length == 0 || el.textContent && el.textContent.length > 0) {
    result = el.textContent;
  }
  else {
    result = {};
    let attrs = el.attributes;
    for (let i = 0; i < attrs.length; i++) {
      let attr = attrs[i];
      let prop = attr.name.replace(/^.*:/g, '');
      result[prop] = attr.value;
    }
  }
  return result;
}
