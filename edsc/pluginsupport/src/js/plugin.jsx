import EdscFacade from './edsc-facade.jsx';

export default class Plugin {
  constructor(name, path) {
    this.name = name;
    this.path = path;
    this.pluginClass = null;
    this.loading = false;
    this._callbackQueue = [];
    this._completionQueue = [];
  }
  load(callback, complete) {
    if (callback) {
      this._callbackQueue.push(callback);
    }
    if (complete) {
      this._completionQueue.push(complete);
    }
    if (this.loading) {
      return;
    }
    this.loading = true;
    if (!this.pluginClass) {
      let script = document.createElement('script');
      script.onload = () => {
        script.parentNode.removeChild(script);
        this._instantiate();
      };
      script.onerror = () => {
        this.loading = false;
        this._complete();
      };
      script.setAttribute("src", this.path);
      document.getElementsByTagName("head")[0].appendChild(script);
    }
    else {
      this._instantiate();
    }
  }
  unload() {
    if (this.pluginClass) {
      this.pluginInstance = null;
      this.loading = false;
    }
  }
  _instantiate() {
    if (this.loading) { // Not unloaded before async finishes
      for (let i = 0; i < this._callbackQueue.length; i++) {
        this._callbackQueue[i](this.pluginClass, new EdscFacade());
      }
    }
    this._callbackQueue = [];
    this._complete();
    this.loading = false;
  }
  _complete() {
    for (let i = 0; i < this._completionQueue.length; i++) {
      this._completionQueue[i]();
    }
    this._completionQueue = [];
  }
};
