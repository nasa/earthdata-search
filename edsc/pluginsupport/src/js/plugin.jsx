import EdscFacade from './edsc-facade.jsx';

export default class Plugin {
  constructor(name, path) {
    this.name = name;
    this.path = path;
    this.pluginClass = null;
    this.pluginInstance = null;
    this.edscFacade = null;
    this.loading = false;
  }
  load(callback) {
    if (this.loading || this.pluginInstance) {
      return;
    }
    this.loading = true;
    if (!this.pluginClass) {
      let script = document.createElement('script');
      script.onload = () => {
        script.parentNode.removeChild(script);
        this._instantiate(callback);
      };
      script.onerror = () => {
        this.loading = false;
      };
      script.setAttribute("src", this.path);
      document.getElementsByTagName("head")[0].appendChild(script);
    }
    else if (!this.pluginInstance) {
      this._instantiate(callback);
    }
  }
  unload() {
    if (this.pluginInstance) {
      this.pluginInstance.destroy(this.edscFacade);
      this.edscFacade = null;
      this.pluginInstance = null;
      this.loading = false;
    }
  }
  _instantiate(callback) {
    if (this.loading) { // Not unloaded before async finishes
      this.edscFacade = new EdscFacade();
      this.pluginInstance = new this.pluginClass(this.edscFacade);
      if (callback) {
        callback(this.name, this);
      }
    }
    this.loading = false;
  }
};
