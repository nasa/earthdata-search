import dom from 'core/src/dom';

export default class EdscFacade {

  addElementHelp(helpKey, options) {
    window.edsc.help.add('_plugin' + helpKey, options);
  }

  removeElementHelp(helpKey) {
    window.edsc.help.remove('_plugin' + helpKey);
  }

  appliedTemporal() {
    return window.edsc.page.query.temporal.applied;
  }
};
