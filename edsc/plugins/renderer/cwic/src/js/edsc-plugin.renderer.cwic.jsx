import style from '../css/cwic.useable.less';

export default class CwicRendererPlugin {
  constructor(edsc) {
    style.use();
    console.log('Loaded cwic renderer plugin');
  }
  destroy(edsc) {
    style.unuse();
    console.log('Unloaded cwic renderer plugin');
  }
};

edscplugin.loaded('renderer.cwic', CwicRendererPlugin);
