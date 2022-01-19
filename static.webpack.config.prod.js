const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TerserJsPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CSSNano = require('cssnano')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const StaticCommonConfig = require('./static.webpack.config.common')

const debug = false

const defaultPlugins = [
  new webpack.ids.HashedModuleIdsPlugin({}),
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].min.css',
    chunkFilename: '[id].[contenthash].min.css'
  })
]

const debugPlugins = [
  new DuplicatePackageCheckerPlugin(),
  new BundleAnalyzerPlugin(),
  new CompressionPlugin()
]

const Config = merge.smartStrategy({
  devtool: 'replace',
  'module.rules.use': 'prepend'
})(StaticCommonConfig, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  output: {
    filename: '[name].[contenthash].bundle.js',
    chunkFilename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'static/dist'),
    publicPath: '/'
  },
  optimization: {
    nodeEnv: 'production',
    concatenateModules: true,
    minimize: true,
    minimizer: [
      new TerserJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        include: /\.js$/
      }),
      new CssMinimizerPlugin()
    ],
    runtimeChunk: true,
    splitChunks: {
      maxInitialRequests: Infinity,
      maxSize: 300000,
      minSize: 150000,
      cacheGroups: {
        vendor: {
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`
          },
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        exclude: /portals/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    ...defaultPlugins,
    ...(debug ? debugPlugins : [])
  ]
})

module.exports = Config
