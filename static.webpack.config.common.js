require('@babel/register')

const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const config = require('./sharedUtils/config')
const { getPortalConfig } = require('./static/src/js/util/portals')

const {
  analytics,
  defaultPortal,
  feedbackApp
} = config.getApplicationConfig()

const portalConfig = getPortalConfig(defaultPortal)

const { ui } = portalConfig

const StaticCommonConfig = {
  name: 'static',
  entry: {
    client: [
      'core-js/stable',
      'regenerator-runtime/runtime',
      'react-hot-loader/patch',
      path.resolve(__dirname, './static/src/index.js')
    ]
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'static/dist'),
    publicPath: '/'
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
      Fonts: path.join(__dirname, 'static/src/assets/fonts'),
      Images: path.join(__dirname, 'static/src/assets/images')
    },
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify")
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules\/(?!(map-obj|snakecase-keys|strict-uri-encode|qs|fast-xml-parser)\/).*/
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        exclude: /portals/i,
        use: [
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: [
                path.resolve(__dirname, 'static/src/css/utils/utils.scss'),
                path.resolve(__dirname, 'static/src/css/vendor/bootstrap/_vars.scss')
              ]
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[path][name].[hash].[ext]'
          }
        }
      },
      {
        test: /portals.*styles\.s?css$/i,
        use: [
          {
            loader: 'style-loader',
            options: { injectType: 'lazyStyleTag' }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false,
    }),
    new HtmlWebPackPlugin({
      template: path.join(__dirname, './static/src/partials/wrapper.html')
    }),
    new HtmlWebpackPartialsPlugin([
      {
        path: path.join(__dirname, './static/src/partials/analytics.html'),
        location: 'head',
        priority: 'high',
        options: {
          environment: process.env.NODE_ENV,
          gtmPropertyId: analytics.gtmPropertyId,
          gaPropertyId: analytics.localIdentifier.propertyId,
          includeDevGoogleAnalytics: analytics.localIdentifier.enabled
        }
      },
      {
        path: path.join(__dirname, './static/src/partials/defaultStyle.html'),
        location: 'head',
        priority: 'high'
      },
      {
        path: path.join(__dirname, './static/src/partials/body.html'),
        options: {
          feedbackApp,
          gtmPropertyId: analytics.gtmPropertyId,
          showTophat: ui.showTophat
        }
      }]),
    new webpack.ids.HashedModuleIdsPlugin({}),
    new CopyWebpackPlugin({
      patterns: [
        { from: './static/src/public', to: './' }
      ]
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    }),
    new ESLintPlugin(),
    // Prevent importing of all moment locales. Moment includes and uses en-us by default.
    // https://medium.com/@michalozogan/how-to-split-moment-js-locales-to-chunks-with-webpack-de9e25caccea
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    })
  ]
}

module.exports = StaticCommonConfig
