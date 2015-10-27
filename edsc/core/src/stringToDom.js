module.exports = function(str) {
  var fragment = document.createDocumentFragment(),
      div = document.createElement('DIV');
  fragment.appendChild(div);
  div.innerHTML = str;
  return div.children;
};
