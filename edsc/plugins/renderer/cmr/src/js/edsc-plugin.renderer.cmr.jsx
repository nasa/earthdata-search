export default class CmrRendererPlugin {
  constructor(edsc) {
    console.log('Loaded cmr renderer plugin');
  }
  destroy(edsc) {
    console.log('Unloaded cmr renderer plugin');
  }
  startSearchFocus() {
    console.log('Start search focus');
  }
  endSearchFocus() {
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
};

edscplugin.loaded('renderer.cmr', CmrRendererPlugin);
