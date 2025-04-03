/**
 * This file runs the services needed to run the application locally. It is executed by running `npm run start`, or `npm run start:optionals`.
 *
 * The script will run `npm run synth` if the CDK template file does not exist.
 *
 * By default the script runs the following services:
 * - Vite (frontend)
 * - Watch (watches the serverless files and rebuilts the backend)
 * - API (backend)
 * - S3 (mocked S3)
 *
 * Optionals services:
 * - ElasticMQ (mocked SQS queues)
 * - SQS (mocked SQS triggers)
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const childProcess = require('child_process')
const concurrently = require('concurrently')
/* eslint-enable */

// If the CDK template file does not exist, run `npm run run-synth` to generate it
if (!fs.existsSync('./cdk/earthdata-search/cdk.out/earthdata-search-dev.template.json')) {
  console.log('The CDK template file does not exist. Running `npm run run-synth` to generate it...')

  childProcess.execSync('npm run run-synth', { stdio: 'inherit' })
}

let sqsCommands = []

const setupSqs = process.env.SKIP_SQS !== 'true'
if (setupSqs) {
  sqsCommands = [{
    // Run the ElasticMQ server
    command: 'npm run start:elasticmq',
    name: 'elasticmq'
  }, {
    // Run the SQS script to trigger lambda functions
    command: 'npm run start:sqs',
    name: 'sqs'
  }]
}

const defaultCommands = [{
  // Run the React code
  command: 'npm run start:app',
  name: 'vite'
}, {
  // Watch the serverless code for changes. This will rebuild the lambdas.
  command: 'npm run watch:api',
  name: 'watch'
}, {
  // Run the API. This script watches the serverless/dist directory and will reload the API
  // when the lambdas are rebuilt by the `watch` service.
  command: 'npm run start:api',
  name: 'api'
}, {
  // Run the S3 server
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
