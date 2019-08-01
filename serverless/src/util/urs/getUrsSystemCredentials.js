import AWS from 'aws-sdk'
import { getSecretEarthdataConfig } from '../../../../sharedUtils/config'
import { cmrEnv } from '../../../../sharedUtils/cmrEnv'

const secretsmanager = new AWS.SecretsManager({ region: 'us-east-1' })

/**
 * Returns the decrypted urs system credentials from Secrets Manager
 */
export const getUrsSystemCredentials = async (ursSystemCredentials) => {
  if (ursSystemCredentials === null) {
    if (process.env.NODE_ENV === 'development') {
      const { cmrSystemUsername, cmrSystemPassword } = getSecretEarthdataConfig(cmrEnv())

      return {
        username: cmrSystemUsername,
        password: cmrSystemPassword
      }
    }

    // Use a variable here for easier find/replace until cmr_env is implemented
    const cmrEnvironment = cmrEnv()

    console.log(`Fetching UrsSystemPasswordSecret_${cmrEnvironment}`)

    const params = {
      SecretId: `UrsSystemPasswordSecret_${cmrEnvironment}`
    }

    // If not running in development mode fetch secrets from AWS
    const secretValue = await secretsmanager.getSecretValue(params).promise()

    return JSON.parse(secretValue.SecretString)
  }

  return ursSystemCredentials
}
