/**
 * This file is only used in the development environment.
 * It mocks a AWS Step Function workflow.
 * It can be used to update the status of an order.
 */

import fs from 'fs'
import { get } from 'lodash-es'
import path from 'path'

// Read the nested stack file and return the contents
const getNestedStack = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))

// Get the state machines from the template
const getStateMachines = (filepath) => {
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

  // Find all the state machines in the template
  const resources = template.Resources
  const stateMachines = Object.keys(resources).filter((key) => resources[key].Type === 'AWS::StepFunctions::StateMachine')

  // Parse the state machines
  const configs = {}
  stateMachines.forEach((key) => {
    const definitionString = resources[key].Properties.DefinitionString
    const { 'Fn::Join': fnJoin } = definitionString
    const stringParts = fnJoin[1]
    const string = stringParts.map((part) => {
      if (typeof part === 'object') {
        return part['Fn::GetAtt'][0]
      }

      return part
    }).join('')

    // Replace the GetAtt function with the actual value
    const regex = /,\s*{\s*"Fn::GetAtt":\s*\[\s*"([^"]+)",\s*"[^"]+"\s*\]\s*},\s*"/g
    const replacedString = string.replaceAll(regex, '": "$1", "')

    const definition = JSON.parse(replacedString)

    // Remove the 8 character has from the end of the `key`
    const stateMachineName = key.slice(0, -8)

    configs[stateMachineName] = definition
  })

  return configs
}

// Do the `Wait` state
const doWait = ({
  callback,
  next,
  payload,
  seconds,
  stateMachine
}) => {
  const waitTime = parseInt(seconds, 10)

  console.log(`Waiting for ${seconds} seconds...`)
  setTimeout(() => {
    callback(stateMachine, next, payload)
  }, waitTime * 1000)
}

// Do the `Task` state
const doTask = async ({
  callback,
  next,
  payload,
  resource,
  stateMachine
}) => {
  // Get the resource from the template
  const [functionName] = resource.split('NestedStack')

  // Lowercase the first letter of the function name
  const lambdaName = functionName.charAt(0).toLowerCase() + functionName.slice(1)
  console.log(`Running task: ${lambdaName}`)

  // Import the handler
  const handlerPath = `../${lambdaName}/handler.js`
  const { default: handler } = (await import(handlerPath)).default

  // Call the handler
  const result = await handler(payload, {})

  // Call the next state with the result of the task
  callback(stateMachine, next, result)
}

// Do the `Choice` state
const doChoice = ({
  callback,
  choices,
  defaultState,
  payload,
  stateMachine
}) => {
  // Loop through the choices
  const result = choices.some((choice) => {
    const {
      Variable: variable,
      StringEquals: stringEquals,
      Next: next
    } = choice

    // Find the variable within the payload
    // `variable` uses JSONPath, and lodash.get doesn't, so remove the `$.`.
    // This works for our limited usecase, but if we add more complex JSONPath variables in the future
    // we'll need to use a proper JSONPath library
    const value = get(payload, variable.replace('$.', ''))

    // Check if the value matches the expected value
    if (value === stringEquals) {
      console.log(`Choice matched: ${variable} === ${stringEquals}, calling next state: ${next}`)

      callback(stateMachine, next, payload)

      return true
    }

    return false
  })

  // If no choice matched, call the `Default` state
  if (!result) {
    if (!defaultState) {
      console.log('No choice matched, and no default state. Returning')

      return
    }

    console.log(`No choice matched, calling default state: ${defaultState}`)
    callback(stateMachine, defaultState, payload)
  }
}

// Run the state machine
const runStateMachine = (stateMachine, stateName = undefined, payload = {}) => {
  // Find the state in the state machine
  const state = stateMachine.States[stateName || stateMachine.StartAt]

  // Run the state
  const {
    Choices: choices,
    Default: defaultState,
    Next: next,
    Resource: resource,
    Seconds: seconds,
    Type: type
  } = state

  switch (type) {
    case 'Wait':
      doWait({
        callback: runStateMachine,
        next,
        payload,
        seconds,
        stateMachine
      })

      break
    case 'Task':
      doTask({
        callback: runStateMachine,
        next,
        payload,
        resource,
        stateMachine
      })

      break
    case 'Choice':
      doChoice({
        callback: runStateMachine,
        defaultState,
        choices,
        payload,
        stateMachine
      })

      break
    case 'Succeed':
      console.log('State machine completed successfully')
      break
    case 'Fail':
      console.log('State machine failed')
      break
    default:
      break
  }
}

export const mockStepFunction = (stateMachineName, payload) => {
  const templateFilePath = 'cdk/earthdata-search/cdk.out/earthdata-search-dev.template.json'
  const stateMachines = getStateMachines(templateFilePath)

  runStateMachine(stateMachines[stateMachineName], undefined, payload)
}
