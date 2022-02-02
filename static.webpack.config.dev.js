const webpack = require('webpack')

const {
  mergeWithCustomize,
  mergeWithRules,
  customizeObject
} = require('webpack-merge')

const WebpackBar = require('webpackbar')

const StaticCommonConfig = require('./static.webpack.config.common')

let Config = mergeWithCustomize({
  customizeObject: customizeObject({
    devtool: 'replace',
    'module.rules.use': 'prepend'
  })
})({
  mode: 'development',
  devtool: 'inline-cheap-module-source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    },
    open: true,
    compress: true,
    hot: true
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
    new WebpackBar(),
    new webpack.HotModuleReplacementPlugin()
  ]
}, StaticCommonConfig)

Config = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      use: 'prepend'
    }
  }
})(Config, {
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
  }
})

module.exports = Config
