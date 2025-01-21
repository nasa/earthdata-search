import fs from 'fs'
import path from 'path'

// Read the nested stack file and return the contents
const getNestedStack = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))

// Function to parse CloudFormation template and extract queue URLs and associated data
export const getQueuesFromTemplate = (filepath) => {
  const file = fs.readFileSync(filepath, 'utf8')
  const template = JSON.parse(file)

  // Combine all the nested stack template resources into the main template
  const combinedTemplate = template
  Object.keys(template.Resources).forEach((resourceId) => {
    const resource = template.Resources[resourceId]

    if (resource.Type === 'AWS::CloudFormation::Stack') {
      const nestedStackPath = resource.Metadata['aws:asset:path']
      const nestedTemplatePath = path.resolve(path.dirname(filepath), nestedStackPath)
      const nestedTemplate = getNestedStack(nestedTemplatePath)

      combinedTemplate.Resources = {
        ...combinedTemplate.Resources,
        ...nestedTemplate.Resources
      }
    }
  })

  const lambdaAssociations = []
  const queueUrls = []

  // Find all the AWS::SQS::Queue resources
  Object.keys(combinedTemplate.Resources).forEach((resourceId) => {
    const resource = combinedTemplate.Resources[resourceId]

    if (resource.Type === 'AWS::SQS::Queue' && !resourceId.includes('DeadLetterQueue')) {
      const queueName = resource.Properties.QueueName
      const visibilityTimeout = resource.Properties.VisibilityTimeout
      const queueUrl = `http://localhost:9324/queue/${queueName}`
      queueUrls.push(queueUrl)
      const shortQueueName = queueName.split('-').pop()

      // Find associated Lambda functions by looking for AWS::Lambda::EventSourceMapping resources
      Object.keys(combinedTemplate.Resources).forEach((resourceId2) => {
        const resource2 = combinedTemplate.Resources[resourceId2]

        if (
          resource2.Type === 'AWS::Lambda::EventSourceMapping'
          && resource2.Properties.EventSourceArn.Ref.includes(shortQueueName)
        ) {
          const lambdaFunctionRef = resource2.Properties.FunctionName.Ref

          // Follow the reference to the Lambda function
          Object.keys(combinedTemplate.Resources).forEach((resourceId3) => {
            const resource3 = combinedTemplate.Resources[resourceId3]

            if (resource3.Type === 'AWS::Lambda::Function' && resourceId3 === lambdaFunctionRef) {
              const name = resource3.Properties.FunctionName
              const lambdaFunctionName = name.split('-').pop()

              lambdaAssociations.push({
                lambdaFunctionName,
                queueName,
                queueUrl,
                visibilityTimeout
              })
            }
          })
        }
      })
    }
  })

  console.log('Queue URLs:', queueUrls)

  return lambdaAssociations
}
