import whatsCwicHtml from '../html/whats-cwic.html';
import caveatsHtml from '../html/caveats.html';

export default class CwicRendererPlugin {
  constructor(edsc, collection) {
    console.log('Loaded cwic renderer plugin');
    this.edsc = edsc;
    this.collection = collection;
    this._layers = [];
    this._needsTemporalWarning = true;
    this._needsSpatialWarning = true;
  }
  destroy(edsc) {
    this.endSearchFocus();
    console.log('Unloaded cwic renderer plugin');
  }
  startSearchFocus() {
    console.log('Start search focus');
    if (!this.edsc.isMapReady()) {
      console.log('Waiting for map ready');
      this._startTimeout = setTimeout((() => this.startSearchFocus()), 200);
      return;
    }
    this.edsc.onMapEvent('draw:editstart draw:drawstart', this._onDrawStart, this);
    this.edsc.onMapEvent('draw:editstop draw:drawstop', this._onDrawEnd, this);
    this.cwicQuery = this.collection.granuleDatasource().cwicQuery();
    let query = this.cwicQuery.params;
    this._onQueryChange(query());
    this._querySubscription = query.subscribe(this._onQueryChange, this);
    this._addCaveats();
  }
  endSearchFocus() {
    if (this._querySubscription) {
      this._querySubscription.dispose();
      this._querySubscription = null;
    }
    clearTimeout(this._startTimeout);
    this.cwicQuery = null;
    this._needsTemporalWarning = true;
    this._clearLayers();
    this.edsc.removeElementHelp('recurringTemporal');
    this._removeCaveats();
    this.edsc.removeElementHelp('mbr');
    console.log('End search focus');
  }
  startSearchView() {
    console.log('Start search view');
  }
  endSearchView() {
    console.log('End search view');
  }
  startAccessPreview() {
    console.log('Start access preview');
  }
  endAccessPreview() {
    console.log('End access preview');
  }

  _addCaveats() {
    let root = document.getElementById('datasource-caveats');
    if (root) {
      root.innerHTML = caveatsHtml;
    }
    document.body.insertAdjacentHTML('beforeend', whatsCwicHtml);
  }

  _removeCaveats() {
    let root;
    root = document.getElementById('cwic-caveats');
    if (root) root.parentNode.removeChild(root);
    root = document.getElementById('whats-cwic-modal');
    if (root) root.parentNode.removeChild(root);
  }

  _onDrawStart() {
    for (let i = 0; i < this._layers.length; i++) {
      this._layers[i].setStyle({stroke: false});
    }
  }

  _onDrawEnd() {
    for (let i = 0; i < this._layers.length; i++) {
      this._layers[i].setStyle({stroke: true});
    }
  }

  _clearLayers() {
    let layer, layers = this._layers, edsc = this.edsc;
    while ((layer = layers.pop())) {
      edsc.removeMapLayer(layer);
    }
  }

  _onQueryChange(query) {
    let isRecurring = query.temporal && query.temporal.split(',').length > 2;

    if (this._needsTemporalWarning && isRecurring && document.getElementById('temporal-query')) {
      let options = {
        title: 'Recurring Temporal Unavailable',
        content: 'This collection cannot be searched with a recurring temporal condition. ' +
          'Search results will show all granules from the start of the first temporal range ' +
          'to the end of the last.',
        placement: 'bottom',
        element: '#temporal-query'
      };
      this.edsc.addElementHelp('recurringTemporal', options);
      this._needsTemporalWarning = false;
    }
    else if (!isRecurring) {
      this._needsTemporalWarning = true;
      this.edsc.removeElementHelp('recurringTemporal');
    }

    this._clearLayers();
    if (query.mbr) {
      let spatialButtons = document.getElementsByClassName('spatial-dropdown-button');
      if (this._needsSpatialWarning && spatialButtons.length > 0) {
        let options = {
          title: 'Polygon Searches Unavailable',
          content: 'This collection cannot be searched with a polygon condition. ' +
            'Search results will show all granules within your area\'s minimum bounding rectangle',
          placement: 'bottom',
          element: 'a.spatial-dropdown-button'
        };
        this.edsc.addElementHelp('mbr', options);
        this._needsSpatialWarning = false;
      }
      let mbr = this.cwicQuery.mbr();
      let opts = {color: "#ff0000", weight: 3, fill: false, dashArray: "2, 10", opacity: 0.8};
      let mbrs = window.edsc.map.mbr.divideMbr(mbr);
      for (let i = 0; i < mbrs.length; i++) {
        let rect = mbrs[i];
        let layer = window.L.rectangle([[rect[0], rect[1]], [rect[2], rect[3]]], opts);
        this.edsc.addMapLayer(layer);
        this._layers.push(layer);
      }
    }
    else {
      this._needsSpatialWarning = true;
    }
  }
};

edscplugin.loaded('renderer.cwic', CwicRendererPlugin);
