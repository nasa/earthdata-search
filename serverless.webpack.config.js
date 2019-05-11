const path = require('path')
const slsw = require('serverless-webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const CopyPlugin = require('copy-webpack-plugin')

// Allow for conditionally copying files into the output for a defined entry
const ConditionalPlugin = (condition, plugin) => ({
  apply: (compiler) => {
    const name = Object.keys(compiler.options.entry)[0].split('/').pop()
    const config = Object.assign({ webpack: {} }, slsw.lib.serverless.service.getFunction(name))

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
    libraryTarget: 'commonjs2',
    library: '[name]'
  },
  externals: [
    nodeExternals()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
          { loader: 'eslint-loader' }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, 'serverless/dist')]),
    ConditionalPlugin(
      (config => config.webpack.includeMigrations),
      new CopyPlugin([
        { from: 'migrations', to: 'migrations' }
      ])
    )
  ]
}

module.exports = ServerlessWebpackConfig
