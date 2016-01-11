import dom from "core/src/dom";

export default class EdscFacade {
  pushMaster(dom) {
    $('.master-overlay').masterOverlay('pluginPushMaster', dom);
  }
  popMaster() {
    $('.master-overlay').masterOverlay('pluginPopMaster');
  }
  bindDom(string, context=window.edsc.page) {
    console.log(context);
    let node = dom.stringToNode(string);
    ko.applyBindings(context, node);
    return node;
  }
};
