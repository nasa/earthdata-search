const DevStaticWebpackConfig = require('./static.webpack.config.dev')
const ServerlessWebpackConfig = require('./serverless.webpack.config')

module.exports = [
  DevStaticWebpackConfig,
  ServerlessWebpackConfig
]
