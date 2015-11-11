import Plugin from './plugin.jsx';

let registry = Symbol();

export default class PluginSupport {
  constructor() {
    this[registry] = {};
  }
  register(name, url) {
    this[registry][name] = new Plugin(url);
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
