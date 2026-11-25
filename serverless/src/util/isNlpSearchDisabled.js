import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm'

// How long to cache the SSM parameter value across warm lambda invocations
const CACHE_TTL_MS = 60 * 1000

let ssmClient

// In-memory cache of the SSM parameter value, persisted across warm lambda invocations
let cachedValue
let cacheExpiresAt = 0

/**
 * Clears the in-memory cache of the SSM parameter value
 */
export const clearNlpSearchDisabledCache = () => {
  cachedValue = undefined
  cacheExpiresAt = 0
}

/**
 * Checks the SSM parameter that is set when the Bedrock budget has been reached.
 * Returns `false` if the parameter name is not configured (e.g. local development)
 * or if the parameter cannot be read, so an SSM issue does not break NLP search.
 * @returns {Promise<Boolean>} True if NLP search has been disabled
 */
export const isNlpSearchDisabled = async () => {
  // In development, return false to allow NLP search to be used without requiring the SSM parameter to be set
  if (process.env.NODE_ENV === 'development') return false

  const { NLP_SEARCH_DISABLED_PARAMETER_NAME: parameterName } = process.env

  if (!parameterName) return false

  if (cachedValue !== undefined && Date.now() < cacheExpiresAt) return cachedValue

  try {
    if (!ssmClient) {
      ssmClient = new SSMClient({ region: 'us-east-1' })
    }

    const { Parameter: parameter = {} } = await ssmClient.send(new GetParameterCommand({
      Name: parameterName
    }))

    console.log(`Read SSM parameter ${parameterName}:`, parameter.Value)

    cachedValue = parameter.Value === 'true'
    cacheExpiresAt = Date.now() + CACHE_TTL_MS

    return cachedValue
  } catch (error) {
    console.error(`Error reading SSM parameter ${parameterName}:`, error)

    return false
  }
}
