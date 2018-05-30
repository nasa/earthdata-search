import style from '../css/ornl.useable.less';

style.use();

let image = null;

$(document).ready(function() {
  // Pre-load logo hover image
  image = new Image();
  image.src = '/images/portals/ornl/ornl-daac-logo-color.png';

  // Include collections that have no granules
  $("p.collection-filters").hide();
  // Not using JQuery check functionality for this part because it interferes with knockout.
  if ($("input#hasNonEOSDIS").is(':checked') == false) {
      $("input#hasNonEOSDIS").trigger('click')
  }
  if ($("input#has-granules").is(':checked') == true) {
      $("input#has-granules").trigger('click')
  }
});
