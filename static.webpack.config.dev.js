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
  })}
)(StaticCommonConfig, {
  mode: 'development',
  devtool: 'inline-cheap-module-source-map',
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
