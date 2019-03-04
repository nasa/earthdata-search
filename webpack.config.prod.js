const ProdStaticWebpackConfig = require('./static.webpack.config.dev.js')
const ServerlessWebpackConfig = require('./serverless.webpack.config')

module.exports = [
  ProdStaticWebpackConfig,
  ServerlessWebpackConfig
]
