var webpack = require("webpack"),
    fs = require('fs'),
    pkg = JSON.parse(fs.readFileSync('./package.json')),
    license;

license = fs.readFileSync('./LICENSE')
  .toString()
  .split(/\s+---\s+/, 1)[0];

module.exports = {
  context: __dirname + '/..',
  entry: {
    "edsc-search": "./edsc/search.js",
    "edsc-access": "./edsc/access.js",
    "edsc-plugin.datasource.cwic": "./edsc/plugins/datasource/cwic/src/js/edsc-plugin.datasource.cwic.jsx",
    "edsc-plugin.renderer.cwic": "./edsc/plugins/renderer/cwic/src/js/edsc-plugin.renderer.cwic.jsx",
    "edsc-plugin.datasource.cmr": "./edsc/plugins/datasource/cmr/src/js/edsc-plugin.datasource.cmr.jsx",
    "edsc-plugin.renderer.cmr": "./edsc/plugins/renderer/cmr/src/js/edsc-plugin.renderer.cmr.jsx",
    "edsc-portal.example": "./edsc/portals/example/src/js/edsc-portal.example.jsx",
    "edsc-portal.ornl": "./edsc/portals/ornl/src/js/edsc-portal.ornl.jsx"
  },
  output: {
    path: "./edsc/dist",
    filename: "[name].min.js"
  },
  module: {
    loaders: [
      { test: /\.useable\.css$/, loader: "style/useable!css" },
      { test: /\.useable\.less$/, loader: "style/useable!css!less" },
      { test: /\.css$/, exclude: /\.useable\.css$/, loader: "style!css" },
      { test: /\.less$/, exclude: /\.useable\.less$/, loader: "style!css!less" },
      { test: /\.coffee$/, loader: "coffee" },
      { test: /\.(coffee\.md|litcoffee)$/, loader: "coffee?literate" },
      { test: /\.jsx$/, exclude: /(node_modules|bower_components)/, loader: 'babel?presets[]=es2015' },
      { test: /\.(gif|png)$/, loader: "url-loader?limit=100000" },
      { test: /\.hbs$/, loader: "handlebars-loader" },
      { test: /\.jpg$/, loader: "file-loader" },
      { test: /\.html$/, loader: "html-loader?removeComments=false" }
    ]
  },
  devtool: '#sourcemap',
  externals: {
    "jquery": "jQuery",
    "window": "window",
    "ko": "ko"
  },
  resolve: {
    extensions: ['', '.js', '.json', '.coffee'],
    modulesDirectories: ['edsc', 'node_modules']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    new webpack.BannerPlugin(license),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "root.jQuery": "jquery"
    })
  ]
};
