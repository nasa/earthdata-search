/**
 * This script will invoke a lambda function locally with a given payload. This
 * can be useful for calling the `migrateDatabase` function, or calling a fetch order
 * lambda outside of a step function. But it will work for any lambda function.
 *
 * Usage:
 * npm run invoke-local <lambdaName> <eventPath>
 */

import fs from 'fs'

// Get the payload from command line arguments
const lambdaName = process.argv[2]
const eventPath = process.argv[3]

// Load the event from the file
const loadEvent = (filepath) => {
  try {
    const event = JSON.parse(fs.readFileSync(filepath, 'utf8'))

    return event
  } catch (error) {
    console.error('Error parsing event:', error)

    return {}
  }
}

// Invoke the given Lambda function
const invokeLambda = async (name, payload = {}) => {
  const handlerPath = `../serverless/dist/${name}/handler.js`
  const { default: handler } = (await import(handlerPath)).default

  console.log(`Calling Lambda: ${name} with payload:`, payload)

  const result = await handler(payload, {})

  console.log('Result:', result)
}

// Load the event from the file
const event = loadEvent(eventPath)

// Invoke the Lambda function
invokeLambda(lambdaName, event)
