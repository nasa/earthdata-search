//= require modernizr-2.6.2-respond-1.1.0.min
//= require jquery3
//= require jquery_ujs
//= require jquery.color-2.1.2
//= require js.cookies
//= require knockout
//= require knockout.mapping
//= require toastr
//= require history.js-1.8.6/jquery.history.js
//= require dropzone-3.8.3
//= require proj4
//= require leaflet-1.3.4/leaflet
//= require leaflet.draw-0.4.14/leaflet.draw
//= require proj4leaflet-1.0.1/proj4leaflet
//= require edsc-search.min
//= require namespaces
//= require config
//= require util/index
//= require modules/map/coordinate
//= require modules/map/arc
//= require modules/map/geoutil
//= require modules/map/mbr
//= require models/index
//= require models/page/search_page
//= require modules/index
//= require bootstrap/bootstrap
//= require components

$(function(){
  $('#spatial_dropdown').on('click mousedown mouseup focus blur keydown change mouseup click dblclick mousemove mouseover mouseout mousewheel keydown keyup keypress textInput touchstart touchmove touchend touchcancel resize scroll zoom focus blur select change submit reset', function(e) {
    console.warn('event', e);
  })
})
