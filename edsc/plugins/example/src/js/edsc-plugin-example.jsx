import style from '../css/example.less';

export default class ExamplePlugin {
  constructor(edsc) {
    style.use();
  }
  destroy(edsc) {
    style.unuse();
  }
};

edscplugin.loaded('edsc-plugin-example', ExamplePlugin);
