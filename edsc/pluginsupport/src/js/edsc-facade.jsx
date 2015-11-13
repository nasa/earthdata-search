export default class EdscFacade {
  pushMaster(dom) {
    $('.master-overlay').masterOverlay('pluginPushMaster', dom);
  }
  popMaster() {
    $('.master-overlay').masterOverlay('pluginPopMaster');
  }
};
