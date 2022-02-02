const path = require('path')
const webpack = require('webpack')

const {
  customizeObject,
  mergeWithCustomize
  // mergeWithRules
} = require('webpack-merge')

const {
  BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// const CSSNano = require('cssnano')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJsPlugin = require('terser-webpack-plugin')

const StaticCommonConfig = require('./static.webpack.config.common')

const defaultPlugins = [
  // This plugin will cause hashes to be based on the relative path of the module, generating a four character string as the module id.
  new webpack.ids.HashedModuleIdsPlugin({}),

  // Remove/clean your build folder(s).
  new CleanWebpackPlugin(),

  // Creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps.
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].min.css',
    chunkFilename: '[id].[contenthash].min.css'
  })
]

const debug = false

const debugPlugins = [
  // Visualize size of webpack output files with an interactive zoomable treemap.
  new BundleAnalyzerPlugin(),

  // Prepare compressed versions of assets to serve them with Content-Encoding.
  new CompressionPlugin(),

  // Provides warning when your bundle contains multiple versions of the same package.
  new DuplicatePackageCheckerPlugin()
]

const Config = mergeWithCustomize({
  customizeObject: customizeObject({
    devtool: 'replace',
    'module.rules.use': 'prepend'
  })
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
      // Use terser to minify/minimize your JavaScript
      new TerserJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        include: /\.js$/
      }),
      // Use cssnano to optimize and minify your CSS
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
        test: /\.(css)$/,
        exclude: /portals/i,
        use: [
          MiniCssExtractPlugin.loader
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
