const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const ServerlessWebpackConfig = {
  name: 'serverless',
  entry: {
    serverless: './serverless/src/handler.js'
  },
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'serverless/dist'),
    filename: 'handler.js',
    libraryTarget: 'umd'
  },
  // optimization: {
  //   minimize: false
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          { loader: 'eslint-loader' }
        ]
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin([path.resolve(__dirname, 'serverless/dist')])
  ]
}

module.exports = ServerlessWebpackConfig
