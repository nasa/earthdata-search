var style = require("../css/cwic.useable.less");

console.log(style);

function toggleClass(el, classname, set) {
  let classes = el.className.split(/\s+/);
  let index = classes.indexOf(classname);
  if (index !== -1 && !set) {
    classes.splice(index, 1);
    this.setClasses(el, classes);
  }
  if (index === -1 && set) {
    classes.push(classname);
  }
  el.className = classes.join(' ');
}

export default class CwicRendererPlugin {
  constructor(edsc, collection) {
    console.log('Loaded cwic renderer plugin');
    this.collection = collection;
  }
  destroy(edsc) {
    console.log('Unloaded cwic renderer plugin');
  }
  startSearchFocus() {
    console.log('Start search focus');
    console.log(style);
    style.use();
    let flag = this._recurringQueryFlag();
    this._onRecurringChange(flag());
    this._recurringSubscription = flag.subscribe(this._onRecurringChange, this);
  }
  endSearchFocus() {
    if (this._recurringSubscription) {
      this._recurringSubscription.dispose();
    }
    this._onRecurringChange(false);
    style.unuse();
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

  _onRecurringChange(isRecurring) {
    let el = document.getElementById('temporal-query');
    toggleClass(el, 'feature-missing', isRecurring);
    console.log('recurring changed', isRecurring);
  }

  _recurringQueryFlag() {
    // Demeter :(. This should probably end up in the facade somehow
    return this.collection.query.temporal.applied.isRecurring;
  }
};

edscplugin.loaded('renderer.cwic', CwicRendererPlugin);
