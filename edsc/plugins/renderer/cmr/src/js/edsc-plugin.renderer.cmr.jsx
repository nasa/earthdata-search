import granuleListStr from '../html/granule-list.html';

export default class CmrRendererPlugin {
  constructor(edsc) {
    this.edsc = edsc;
    console.log('Loaded cmr renderer plugin');
  }
  destroy(edsc) {
    console.log('Unloaded cmr renderer plugin');
  }
  // TODO: Timeline?
  startSearchFocus(collection) {
    // Draw granules list
    this.granuleList = this.edsc.bindDom(granuleListStr);
    this.edsc.pushMaster(this.granuleList);
    /*
      <%= render partial: 'granule_list' %>
      <%= render partial: 'granule_details' %>
    */
    console.log('Start search focus');
  }
  endSearchFocus(collection) {
    // Stop drawing granules list
    console.log('End search focus');
  }
  startSearchView(collection) {
    // Draw on map
    console.log('Start search view');
  }
  endSearchView(collection) {
    // Stop drawing on map
    console.log('End search view');
  }
  startAccessPreview(collection) {
    console.log('Start access preview');
  }
  endAccessPreview(collection) {
    console.log('End access preview');
  }
};

edscplugin.loaded('renderer.cmr', CmrRendererPlugin);
