const merge = require('webpack-merge')
const WebpackBar = require('webpackbar')

const StaticCommonConfig = require('./static.webpack.config.common')

const Config = merge.smartStrategy(
  {
    devtool: 'replace',
    'module.rules.use': 'prepend'
  }
)(StaticCommonConfig, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        exclude: /portals/i,
        use: [
          {
            loader: 'style-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new WebpackBar()
  ]
})

module.exports = Config
