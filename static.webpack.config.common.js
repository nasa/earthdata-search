const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const StaticCommonConfig = {
  name: 'static',
  entry: {
    client: './static/src/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'static/dist'),
    publicPath: '/'
  },
  resolve: {
    alias: {
      Fonts: path.join(__dirname, 'static/src/assets/fonts'),
      Images: path.join(__dirname, 'static/src/assets/images')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /font-awesome.config.js/],
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
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
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
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
      chunkFilename: '[id].min.css',
      publicPath: '/'
    }),
    new CopyWebpackPlugin([
      { from: './static/src/public', to: './' }
    ]),
    new webpack.ProvidePlugin({
      jQuery: 'jquery'
    }),
    // Prevent importing of all moment locales. Moment includes and uses en-us by default.
    // https://medium.com/@michalozogan/how-to-split-moment-js-locales-to-chunks-with-webpack-de9e25caccea
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}

module.exports = StaticCommonConfig
