import style from '../css/example.useable.less';

export default class ExamplePlugin {
  constructor(edsc) {
    style.use();
    console.log('Loaded example plugin');
  }
  destroy(edsc) {
    style.unuse();
    console.log('Unloaded example plugin');
  }
};

edscplugin.loaded('example', ExamplePlugin);
