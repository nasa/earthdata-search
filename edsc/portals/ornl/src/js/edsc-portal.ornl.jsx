import style from '../css/ornl.useable.less';

style.use();

let image = null;

$(document).ready(function() {
  // Pre-load logo hover image
  image = new Image();
  image.src = '/images/portals/ornl/ornl-daac-logo-color.png';
});
