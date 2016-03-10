import whatsCwicHtml from '../html/whats-cwic.html';
import caveatsHtml from '../html/caveats.html';

export default class CwicRendererPlugin {
  constructor(edsc, collection) {
    console.log('Loaded cwic renderer plugin');
    this.edsc = edsc;
    this.collection = collection;
    this._needsTemporalWarning = true;
  }
  destroy(edsc) {
    console.log('Unloaded cwic renderer plugin');
  }
  startSearchFocus() {
    console.log('Start search focus');
    let query = this.collection.granuleDatasource().cwicQuery().params;
    this._onQueryChange(query());
    this._querySubscription = query.subscribe(this._onQueryChange, this);
    this._addCaveats();
  }
  endSearchFocus() {
    if (this._querySubscription) {
      this._querySubscription.dispose();
    }
    this._needsTemporalWarning = true;
    this.edsc.removeElementHelp('recurringTemporal');
    this._removeCaveats();
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

  _onQueryChange(query) {
    let key = 'recurringTemporal';

    let isRecurring = query.temporal && query.temporal.split(',').length > 2;

    if (this._needsTemporalWarning && isRecurring) {
      this._needsTemporalWarning = false;
      let options = {
        title: 'Recurring Temporal Unavailable',
        content: 'This collection cannot be searched with a recurring temporal condition. ' +
          'Search results will show all granules from the start of the first temporal range ' +
          'to the end of the last.',
        placement: 'bottom',
        element: '#temporal-query'
      };
      if (document.getElementById('temporal-query')) {
        this.edsc.addElementHelp(key, options);
      }
    }
    else if (!isRecurring) {
      this._needsTemporalWarning = true;
      this.edsc.removeElementHelp(key);
    }
  }
};

edscplugin.loaded('renderer.cwic', CwicRendererPlugin);
