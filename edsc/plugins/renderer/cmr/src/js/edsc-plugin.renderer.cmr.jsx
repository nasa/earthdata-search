export default class CmrRendererPlugin {
  constructor(edsc) {
    console.log('Loaded cmr renderer plugin');
  }
  destroy(edsc) {
    console.log('Unloaded cmr renderer plugin');
  }
};

edscplugin.loaded('renderer.cmr', CmrRendererPlugin);
