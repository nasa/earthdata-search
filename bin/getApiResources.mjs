import fs from 'fs'
import path from 'path'

// Read the nested stack file and return the contents
const getNestedStack = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))

// Return the resource from a Fn::GetAtt reference
const getResourceFromGetAtt = (getAtt, template, templateFilePath) => {
  const [resourceName, attribute] = getAtt

  const nestedStackResource = template.Resources[resourceName]

  if (nestedStackResource.Type === 'AWS::ApiGateway::RestApi') return ''

  const nestedStackPath = nestedStackResource.Metadata['aws:asset:path']
  const nestedStack = getNestedStack(path.resolve(path.dirname(templateFilePath), nestedStackPath))

  // eslint-disable-next-line no-unused-vars
  const [_, outputValue] = attribute.split('.')

  // Get the output value from the nested stack
  return nestedStack.Outputs[outputValue].Value.Ref
}

const getReferenceToResource = (ref, template, templateFilePath) => {
  let value

  Object.keys(template.Resources).forEach((refResourceKey) => {
    const templateResource = template.Resources[refResourceKey]

    if (templateResource.Type === 'AWS::CloudFormation::Stack') {
      const { Parameters: parameters } = templateResource.Properties

      if (parameters && parameters[ref]) {
        const { Ref: paramRef, 'Fn::GetAtt': paramGetAtt } = parameters[ref]
        if (paramGetAtt) {
          value = getResourceFromGetAtt(paramGetAtt, template, templateFilePath)
        } else {
          value = paramRef
        }
      }
    }
  })

  return value
}

// Construct the full path for the given resource
const getPathForResource = (resource, template, templateFilePath) => {
  const { PathPart: pathPart, ParentId: parentId } = resource.Properties

  // If there is no parentId, return the pathPart
  if (!parentId) {
    return pathPart
  }

  let { Ref: parentRef = '' } = parentId
  const { 'Fn::GetAtt': parentGetAtt = [] } = parentId

  if (parentGetAtt.length) {
    parentRef = getResourceFromGetAtt(parentGetAtt, template, templateFilePath)
  }

  // If the parentRef is a ref to a nested stack parameter, follow that ref to get the parent resource
  if (parentRef.startsWith('referenceto')) {
    parentRef = getReferenceToResource(parentRef, template, templateFilePath)
  }

  // If there is no parentRef, return the pathPart (it will be the root resource)
  if (!parentRef) {
    return pathPart
  }

  const parentResource = template.Resources[parentRef]

  return `${getPathForResource(parentResource, template, templateFilePath)}/${pathPart}`
}

// Remove everything after `Lambda` and lowercase the first letter
const getLambdaName = (functionName) => {
  const [trimmedName] = functionName.split('Lambda')

  return trimmedName.charAt(0).toLowerCase() + trimmedName.slice(1)
}

// Get all the API resources from the template
export const getApiResources = (templateFilePath) => {
  const template = JSON.parse(fs.readFileSync(templateFilePath, 'utf8'))

  // Find nested stack templates from DependsOn array of AWS::ApiGateway::Deployment
  const nestedStackPaths = []
  Object.keys(template.Resources).forEach((resourceKey) => {
    const resource = template.Resources[resourceKey]

    if (resource.Type === 'AWS::ApiGateway::Deployment' && resource.DependsOn) {
      resource.DependsOn.forEach((dep) => {
        if (template.Resources[dep] && template.Resources[dep].Type === 'AWS::CloudFormation::Stack') {
          const nestedStack = template.Resources[dep]
          nestedStackPaths.push(nestedStack.Metadata['aws:asset:path'])
        }
      })
    }
  })

  // Combine all the nested stack template resources into the main template
  const combinedTemplate = template
  nestedStackPaths.forEach((nestedStackPath) => {
    const nestedTemplatePath = path.resolve(path.dirname(templateFilePath), nestedStackPath)
    const nestedTemplate = getNestedStack(nestedTemplatePath)

    combinedTemplate.Resources = {
      ...combinedTemplate.Resources,
      ...nestedTemplate.Resources
    }
  })

  // Find all the AWS::ApiGateway::Resource to construct full API paths
  const apiResources = {}
  Object.keys(combinedTemplate.Resources).forEach((resourceKey) => {
    const resource = combinedTemplate.Resources[resourceKey]
    if (resource.Type === 'AWS::ApiGateway::Resource') {
      const fullPath = getPathForResource(resource, combinedTemplate, templateFilePath)

      apiResources[resourceKey] = {
        fullPath,
        methods: []
      }
    }
  })

  // Find all the AWS::ApiGateway::Method resources to get the HttpMethod and the lambda and authorizers associated with it
  Object.keys(combinedTemplate.Resources).forEach((resourceKey) => {
    const resource = combinedTemplate.Resources[resourceKey]
    if (resource.Type === 'AWS::ApiGateway::Method') {
      const {
        HttpMethod: httpMethod,
        ResourceId: resourceId,
        AuthorizerId: authorizerId
      } = resource.Properties

      let apiGatewayResource = resourceId.Ref
      // If the parentRef is a ref to a nested stack parameter, follow that ref to get the parent resource
      if (apiGatewayResource.startsWith('referenceto')) {
        apiGatewayResource = getReferenceToResource(resourceId.Ref, template, templateFilePath)
      }

      const authorizer = {}
      const authorizerRef = authorizerId?.Ref

      if (authorizerRef) {
        const authorizerFunctionName = getReferenceToResource(authorizerRef, template, templateFilePath)

        authorizer.functionName = authorizerFunctionName
        authorizer.path = `../serverless/dist/${getLambdaName(authorizerFunctionName)}/handler.js`
      }

      // Get the function name from the lambda integration
      const lambdaIntegration = resource.Properties.Integration
      if (lambdaIntegration.Type === 'AWS_PROXY' && lambdaIntegration.Uri) {
        const { Uri: uri } = lambdaIntegration
        const { 'Fn::Join': join } = uri
        // eslint-disable-next-line no-unused-vars
        const [_, parts] = join
        const { 'Fn::GetAtt': functionGetAtt } = parts[1]
        const functionName = functionGetAtt[0]

        // Get the function configuration from the lambda function
        const lambdaFunction = {
          functionName,
          path: `../serverless/dist/${getLambdaName(functionName)}/handler.js`
        }

        const name = apiGatewayResource.replace('referencetoearthdatasearchdev', '')
        apiResources[name].methods.push({
          httpMethod,
          authorizer,
          lambdaFunction
        })
      }
    }
  })

  return apiResources
}
