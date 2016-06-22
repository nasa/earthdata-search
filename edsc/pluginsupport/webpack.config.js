var webpack = require("webpack"),
    fs = require('fs'),
    pkg = JSON.parse(fs.readFileSync('./package.json')),
    license;

license = fs.readFileSync('../../LICENSE')
  .toString()
  .split(/\s+---\s+/, 1)[0];

module.exports = {
  context: __dirname,
  entry: "./src/js/" + pkg.name + ".jsx",
  output: {
    path: __dirname + "/dist",
    filename: pkg.name + ".min.js"
  },
  module: {
    loaders: [
      { test: /\.use\.css$/, loader: "style/useable!css" },
      { test: /\.use\.less$/, loader: "style/useable!css!less" },
      { test: /\.css$/, exclude: /\.use\.css$/, loader: "style!css" },
      { test: /\.less$/, exclude: /\.use\.less$/, loader: "style!css!less" },
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
