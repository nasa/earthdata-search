const merge = require('webpack-merge')
const HtmlWebPackPlugin = require('html-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const extractHtml = new HtmlWebPackPlugin({
  template: './static/src/public/index.html',
  filename: './index.html'
})

const StaticCommonConfig = require('./static.webpack.config.common')

const Config = merge(StaticCommonConfig, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    extractHtml
    // new BundleAnalyzerPlugin()
  ]
})

module.exports = Config
