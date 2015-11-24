import Plugin from './plugin.jsx';

let registry = '_edsc_registry';
let loadingCount = '_edsc_loadingCount';
let callbacks = '_edsc_callbacks';

export default class PluginSupport {
  constructor() {
    this[registry] = {};
    this[loadingCount] = 0;
    this[callbacks] = [];
  }
  register(name, url) {
    this[registry][name] = new Plugin(name, url);
    console.log(`Registered plugin: ${name} (${url})`);
  }
  load(name, callback, complete) {
    let onComplete = () => {
      this[loadingCount]--;
      if (complete) complete();
      let allCallbacks = this[callbacks];
      for (let i = 0; i < allCallbacks.length; i++) {
        allCallbacks[i]();
      }
    };
    this[loadingCount]++;
    this[registry][name].load(callback, onComplete);
  }
  unload(name) {
    this[registry][name].unload();
  }
  loaded(name, klass) {
    this[registry][name].pluginClass = klass;
  }
  hasPending() {
    return this[loadingCount] !== 0;
  }
  onAllComplete(callback) {
    this[callbacks].push(callback);
  }
};

window.edscplugin = new PluginSupport();
