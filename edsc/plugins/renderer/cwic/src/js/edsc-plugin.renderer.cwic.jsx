import style from '../css/cwic.useable.less';

export default class CwicRendererPlugin {
  constructor(edsc) {
    //style.use();
    console.log('Loaded cwic renderer plugin');
  }
  destroy(edsc) {
    //style.unuse();
    console.log('Unloaded cwic renderer plugin');
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

edscplugin.loaded('renderer.cwic', CwicRendererPlugin);
