import dom from 'core/src/dom';

export default class EdscFacade {

  addElementHelp(helpKey, options) {
    window.edsc.help.add('_plugin' + helpKey, options);
  }

  removeElementHelp(helpKey) {
    window.edsc.help.remove('_plugin' + helpKey);
  }

  appliedTemporal() {
    return window.edsc.page.query.temporal.applied;
  }

  addMapLayer(layer) {
    let map = $('#map').data('map');
    if (map) map.addLayer(layer);
    return map != null;
  }

  removeMapLayer(layer) {
    let map = $('#map').data('map');
    if (map) map.removeLayer(layer);
  }

  isMapReady() {
    return $('#map').data('map') != null;
  }

  onMapEvent(name, callback, context) {
    let map = $('#map').data('map');
    if (map) map.map.on(name, callback, context);
  }

  offMapEvent(name, callback, context) {
    let map = $('#map').data('map');
    if (map) map.map.off(name, callback, context);
  }
};
