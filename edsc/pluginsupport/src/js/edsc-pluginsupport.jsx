import Plugin from './plugin.jsx';

let registry = Symbol();

export default class PluginSupport {
  constructor() {
    this[registry] = {};
  }
  register(name, url) {
    this[registry][name] = new Plugin(name, url);
    console.log("Registered plugin:", name, url);
  }
  load(name, callback, complete) {
    this[registry][name].load(callback, complete);
  }
  unload(name) {
    this[registry][name].unload();
  }
  loaded(name, klass) {
    this[registry][name].pluginClass = klass;
  }
};

window.edscplugin = new PluginSupport();
