import EdscFacade from './edsc-facade.jsx';

export default class Plugin {
  constructor(path) {
    this.path = path;
    this.pluginClass = null;
    this.pluginInstance = null;
    this.edscFacade = null;
    this.loading = false;
  }
  load() {
    if (this.loading || this.pluginInstance) {
      return;
    }
    this.loading = true;
    if (!this.pluginClass) {
      let script = document.createElement('script');
      script.onload = () => {
        script.parentNode.removeChild(script);
        this.instantiate();
      };
      script.onerror = () => {
        this.loading = false;
      };
      script.setAttribute("src", this.path);
      document.getElementsByTagName("head")[0].appendChild(script);
    }
    else if (!this.pluginInstance) {
      this.instantiate();
    }
  }
  instantiate() {
    this.edscFacade = new EdscFacade();
    this.pluginInstance = new this.pluginClass(this.edscFacade);
    this.loading = false;
  }
  unload() {
    if (this.pluginInstance) {
      this.pluginInstance.destroy(this.edscFacade);
      this.edscFacade = null;
      this.pluginInstance = null;
    }
  }
};
