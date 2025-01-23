const fs = require('fs')
const childProcess = require('child_process')
const concurrently = require('concurrently')

// If the CDK template file does not exist, run `npm run run-synth` to generate it
if (!fs.existsSync('./cdk/earthdata-search/cdk.out/earthdata-search-dev.template.json')) {
  console.log('The CDK template file does not exist. Running `npm run run-synth` to generate it...')

  childProcess.execSync('npm run run-synth', { stdio: 'inherit' })
}

let sqsCommands = []

const setupSqs = process.env.SKIP_SQS !== 'true'
if (setupSqs) {
  sqsCommands = [{
    command: 'npm run start:elasticmq',
    name: 'elasticmq'
  }, {
    command: 'npm run start:sqs',
    name: 'sqs'
  }]
}

const defaultCommands = [{
  command: 'npm run start:app',
  name: 'vite'
}, {
  command: 'npm run watch:api',
  name: 'watch'
}, {
  command: 'npm run start:api',
  name: 'api'
}, {
  command: 'npm run start:s3',
  name: 's3'
}]

// Start the services
concurrently(sqsCommands.concat(defaultCommands), {
  prefix: 'name',
  padPrefix: true,
  prefixColors: 'auto',
  handleInput: true,
  defaultInputTarget: setupSqs ? 3 : 1
})
