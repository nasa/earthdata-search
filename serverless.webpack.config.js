const path = require('path')
const slsw = require('serverless-webpack')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const CopyPlugin = require('copy-webpack-plugin')
// const ESLintPlugin = require('eslint-webpack-plugin')

// Allow for conditionally copying files into the output for a defined entry
const ConditionalPlugin = (condition, plugin) => ({
  apply: (compiler) => {
    const name = Object.keys(compiler.options.entry)[0].split('/')

    // Pull the filename of the Lambda
    let fileName = name.pop()

    // For lambdas that have been updated to the new `serverless/src/LAMBDA/handler.js`
    if (fileName === 'handler') {
      fileName = name.pop()
    }

    const config = {
      webpack: {},
      ...slsw.lib.serverless.service.getFunction(fileName)
    }

    if (condition(config)) {
      plugin.apply(compiler)
    }
  }
})

const ServerlessWebpackConfig = {
  name: 'serverless',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'serverless/dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs',
    clean: true // Replaces CleanWebpackPlugin in Webpack 5
  },
  externalsPresets: {
    node: true
  },
  externals: [
    nodeExternals()
  ],
  // optimization: {
  //   minimize: false
  // },
  // performance: {
  //   // Turn off size warnings for entry points
  //   hints: false
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ]
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin([path.resolve(__dirname, 'serverless/dist')]),
    ConditionalPlugin(
      ((config) => config.webpack.includeMigrations),
      new CopyPlugin({
        patterns: [
          { from: 'migrations', to: 'migrations' }
        ]
      })
    )
    // new ESLintPlugin()
  ]
}

module.exports = ServerlessWebpackConfig
