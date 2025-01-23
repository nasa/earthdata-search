import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand
} from '@aws-sdk/client-sqs'

import { getQueuesFromTemplate } from './getQueuesFromTemplate.mjs'

// Get the template path from command line arguments
const templatePath = process.argv[2]
if (!templatePath) {
  console.error('Please provide the path to the CloudFormation template as a command line argument.')
  process.exit(1)
}

// Configure the AWS SDK with the ElasticMQ endpoint
const client = new SQSClient({
  endpoint: 'http://localhost:9324', // Replace with your ElasticMQ endpoint
  region: 'us-east-1', // Replace with your desired region
  credentials: {
    accessKeyId: 'x', // Dummy access key
    secretAccessKey: 'x' // Dummy secret key
  }
})

const receiveMessages = async ({
  lambdaFunctionName,
  queueName,
  queueUrl
}) => {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10
  }

  try {
    const command = new ReceiveMessageCommand(params)
    const data = await client.send(command)
    if (data.Messages) {
      // Process each message
      data.Messages.forEach(async (message) => {
        console.log(`Message in ${queueName}:`, message)

        const sqsMessage = { Records: [{ body: message.Body }] }

        const handlerPath = `../serverless/dist/${lambdaFunctionName}/handler.js`

        const { default: handler } = (await import(handlerPath)).default

        try {
          console.log(`Calling Lambda: ${lambdaFunctionName}`)
          await handler(sqsMessage, {})
        } catch (error) {
          console.log(`Error calling Lambda: ${lambdaFunctionName}`, error)
        }

        // Delete the message after processing
        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle
        }
        const deleteCommand = new DeleteMessageCommand(deleteParams)
        await client.send(deleteCommand)
        console.log('Deleted message:', message.MessageId)
      })
    } else {
      console.log(`No messages to receive from ${queueUrl}`)
    }
  } catch (error) {
    console.error(`Error receiving messages from ${queueUrl}:`, error)
  }
}

const queues = getQueuesFromTemplate(templatePath)
console.log('Queues:', queues)

const pollMessages = async () => {
  await Promise.all(queues.map(async (association) => {
    await receiveMessages(association)
  }))

  // Wait for 5 seconds before polling again
  setTimeout(pollMessages, 5000)
}

pollMessages()
