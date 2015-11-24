import Plugin from './plugin.jsx';

let registry = Symbol();

export default class PluginSupport {
  constructor() {
    this[registry] = {
      "edsc-plugin-example": new Plugin("file:///Users/pquinn/earthdata/search/edsc/plugins/example/dist/edsc-plugin-example.min.js")
    };
  }
  load(name) {
    this[registry][name].load();
  }
  unload(name) {
    this[registry][name].unload();
  }
  loaded(name, klass) {
    this[registry][name].pluginClass = klass;
  }
};

window.edscplugin = new PluginSupport();
