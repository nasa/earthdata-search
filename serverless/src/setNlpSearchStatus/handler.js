import {
  GetParameterCommand,
  PutParameterCommand,
  SSMClient
} from '@aws-sdk/client-ssm'

let ssmClient

/**
 * Determines whether NLP search should be disabled or enabled based on the event source.
 * - SNS events are published by the Bedrock AWS Budget when the spend threshold is reached
 * - The monthly EventBridge schedule passes `{ action: 'enable' }` when the budget resets
 * @param {Object} event SNS event or scheduled event input
 * @returns {String|null} `disable`, `enable`, or null if the event is not recognized
 */
const getAction = (event = {}) => {
  const { Records: records = [], action } = event

  if (records.some(({ EventSource: eventSource }) => eventSource === 'aws:sns')) return 'disable'

  if (action === 'enable' || action === 'disable') return action

  return null
}

/**
 * Sets the NLP search disabled SSM parameter.
 * - Triggered by an SNS message from the Bedrock AWS Budget when actual spending reaches
 *   the configured threshold, which disables NLP search
 * - Triggered by a schedule at the start of each month when the budget resets, which
 *   re-enables NLP search
 * @param {Object} event SNS event or scheduled event input
 */
const setNlpSearchStatus = async (event) => {
  const { NLP_SEARCH_DISABLED_PARAMETER_NAME: parameterName } = process.env

  const action = getAction(event)

  if (!action) {
    console.log('Unrecognized event, no action taken:', JSON.stringify(event))

    return {
      parameterName,
      updated: false
    }
  }

  if (action === 'disable') {
    const { Records: records = [] } = event

    records.forEach(({ Sns: snsMessage = {} }) => {
      const { Subject: subject, Message: message } = snsMessage

      console.log(`Received budget notification: ${subject}`)
      console.log(message)
    })
  }

  const value = action === 'disable' ? 'true' : 'false'

  if (!ssmClient) {
    ssmClient = new SSMClient({ region: 'us-east-1' })
  }

  const { Parameter: parameter = {} } = await ssmClient.send(new GetParameterCommand({
    Name: parameterName
  }))

  // Avoid creating a new parameter version when the value is already set
  if (parameter.Value === value) {
    console.log(`SSM parameter ${parameterName} is already set to ${value}, no update needed`)

    return {
      parameterName,
      updated: false,
      value
    }
  }

  await ssmClient.send(new PutParameterCommand({
    Name: parameterName,
    Overwrite: true,
    Type: 'String',
    Value: value
  }))

  console.log(`Set SSM parameter ${parameterName} to ${value}, NLP search has been ${action}d`)

  return {
    parameterName,
    updated: true,
    value
  }
}

export default setNlpSearchStatus
