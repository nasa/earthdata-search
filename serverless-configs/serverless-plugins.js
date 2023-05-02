module.exports.plugins = [
  'serverless-finch',
  'serverless-webpack',
  'serverless-step-functions',
  'serverless-plugin-split-stacks',
  'serverless-plugin-log-subscription',
  'serverless-plugin-ifelse',
  ...((`${process.env.SQS}`).toLowerCase() === 'true' ? ['serverless-offline-sqs'] : []),
  ...((`${process.env.S3}`).toLowerCase() === 'true' ? ['./serverless-plugins/serverless-offline-config-s3.js'] : []),
  'serverless-offline',
  './serverless-plugins/serverless-webpack-include-migrations.js'
]
