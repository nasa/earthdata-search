/**
 * This script generates an elasticmq.conf file based on the CDK template provided.
 *
 * In the future if we add more queues this should allow us the run SQS locally without needing to
 * do any configurations outside of the CDK projects.
 *
 * This does not implement dead letter queues.
 * It will only apply the visibilityTimeout property to the queues. If more properties are needed
 * in the future, they can be added.
 */

import fs from 'fs'

import { getQueuesFromTemplate } from './getQueuesFromTemplate.mjs'

// Get the template path from command line arguments
const templatePath = process.argv[2]
if (!templatePath) {
  console.error('Please provide the path to the CloudFormation template as a command line argument.')
  process.exit(1)
}

const queues = getQueuesFromTemplate(templatePath)
console.log('Found Queues:', queues)

// Generate the elasticmq.conf content
const generateElasticMQConfig = (queueList) => {
  let configContent = 'include classpath("application.conf")\n\nqueues {\n'

  queueList.forEach((queue) => {
    const { queueName, visibilityTimeout } = queue
    configContent += `  ${queueName} {\n    defaultVisibilityTimeout = ${visibilityTimeout} seconds\n  }\n`
  })

  configContent += '}'

  return configContent
}

const configContent = generateElasticMQConfig(queues)

// Write the content to elasticmq.conf
const outputPath = 'elasticmq.conf'
fs.writeFileSync(outputPath, configContent, 'utf8')
console.log(`ElasticMQ configuration written to ${outputPath}`)
