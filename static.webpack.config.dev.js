const {
  mergeWithRules
} = require('webpack-merge')

const WebpackBar = require('webpackbar')

const StaticCommonConfig = require('./static.webpack.config.common')

const Config = mergeWithRules({
  devtool: 'replace',
  module: {
    rules: {
      test: 'match',
      use: 'prepend'
    }
  }
})(StaticCommonConfig, {
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
    compress: true
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
