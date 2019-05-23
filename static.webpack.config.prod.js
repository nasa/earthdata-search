const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJsPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CSSNano = require('cssnano')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const StaticCommonConfig = require('./static.webpack.config.common')

const extractHtml = new HtmlWebPackPlugin({
  template: './static/src/public/index.html',
  filename: './index.html'
})

const Config = merge(StaticCommonConfig, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].bundle.js',
    chunkFilename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'static/dist'),
    publicPath: '/'
  },
  optimization: {
    minimizer: [
      new TerserJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        include: /\.js$/
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: CSSNano,
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }]
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          maxSize: 500000
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    runtimeChunk: true
  },
  plugins: [
    extractHtml,
    new webpack.HashedModuleIdsPlugin(),
    new CleanWebpackPlugin([path.resolve(__dirname, 'static/dist')]),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].min.css',
      chunkFilename: '[id].[contenthash].min.css',
      publicPath: '/'
    }),
    new CopyWebpackPlugin([
      { from: './static/src/public', to: './' }
    ]),
    new BundleAnalyzerPlugin()
  ]
})

module.exports = Config
