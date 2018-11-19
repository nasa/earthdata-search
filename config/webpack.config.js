var webpack = require("webpack"),
    fs = require('fs'),
    path = require('path'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    license;

license = fs.readFileSync('./LICENSE')
  .toString()
  .split(/\s+---\s+/, 1)[0];

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, '..'),
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
    path: path.resolve(__dirname, '../edsc/dist'),
    filename: "[name].min.js"
  },
  module: {
    rules: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.useable\.css$/, loader: "style-loader/useable!css-loader" },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader", exclude: /\.useable\.less$/, },
      { test: /\.useable\.less$/, loader: "style-loader/useable!css-loader!less-loader" },
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate" },
      { test: /\.(gif|png)$/, loader: "url-loader?limit=100000" },
      { test: /\.jsx$/, exclude: /(node_modules|bower_components)/, loader: 'babel-loader?presets[]=es2015' },
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
    extensions: ['.js', '.json', '.coffee'],
    modules: ['edsc', 'node_modules']
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({ uglifyOptions: { compress: { warnings: false } } } )]
  },
  plugins: [
    // https://github.com/webpack/webpack/issues/6556
    new webpack.LoaderOptionsPlugin({ options: {} }),

    // Copy the license file into each entry above
    new webpack.BannerPlugin(license),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "root.jQuery": "jquery"
    })
  ]
};
