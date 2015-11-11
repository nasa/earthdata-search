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
    "edsc-plugin.example": "./edsc/plugins/example/src/js/edsc-plugin-example.jsx"
  },
  output: {
    path: "./edsc/dist",
    filename: "[name].min.js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      { test: /\.less$/, loader: "style!css!less" },
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
    new webpack.BannerPlugin(license),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "root.jQuery": "jquery"
    })
  ]
};
