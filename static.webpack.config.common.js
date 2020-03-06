require('@babel/register')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const config = require('./sharedUtils/config')

const envConfig = config.getEnvironmentConfig()
const appEnv = config.getApplicationConfig().env
const earthdataConfig = config.getEarthdataConfig(appEnv)

const StaticCommonConfig = {
  name: 'static',
  entry: {
    client: [
      'core-js/stable',
      'regenerator-runtime/runtime',
      'react-hot-loader/patch',
      './static/src/index.js'
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
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          /node_modules\/(?!(map-obj|snakecase-keys|strict-uri-encode|qs|fast-xml-parser)\/).*/,
          /font-awesome.config.js/
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/react']
            }
          },
          { loader: 'eslint-loader' }
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
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              // eslint-disable-next-line
              resources: require(path.join(process.cwd(), "/static/src/css/globalUtils.js")),
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
        test: /font-awesome\.config\.js/,
        use: [
          { loader: 'style-loader' },
          { loader: 'font-awesome-loader' }
        ]
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
          gtmPropertyId: envConfig.gtmPropertyId,
          includeGoogleTagManager: envConfig.includeGoogleTagManager,
          gaId: envConfig.gaId,
          includeDevGoogleAnalytics: envConfig.includeDevGoogleAnalytics
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
          feedbackApp: earthdataConfig.feedbackApp,
          gtmPropertyId: envConfig.gtmPropertyId
        }
      },
      {
        path: path.join(__dirname, './static/src/partials/ntpagetag.html'),
        location: 'body',
        options: {
          includeNtPageTag: envConfig.includeNtPageTag
        }
      }]),
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([
      { from: './static/src/public', to: './' }
    ]),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    }),
    // Prevent importing of all moment locales. Moment includes and uses en-us by default.
    // https://medium.com/@michalozogan/how-to-split-moment-js-locales-to-chunks-with-webpack-de9e25caccea
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}

module.exports = StaticCommonConfig
