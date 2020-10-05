import AWS from 'aws-sdk'

import { getSecretAdminUsers } from '../../../sharedUtils/config'
import { getSecretsManagerConfig } from './aws/getSecretsManagerConfig'

let adminUsers
let secretsmanager

/**
 * Retrieve a list of users authorized to access the admin dashboard
 */
export const getAdminUsers = async () => {
  if (adminUsers == null) {
    if (secretsmanager == null) {
      secretsmanager = new AWS.SecretsManager(getSecretsManagerConfig())
    }

    if (process.env.NODE_ENV === 'development') {
      adminUsers = getSecretAdminUsers()

      return adminUsers
    }

    const params = {
      SecretId: 'EDSC_Admins'
    }

    const secretValue = await secretsmanager.getSecretValue(params).promise()

    // Secrets Manager requires key/value pairs, so AWS converts an array to an indexed object
    adminUsers = Object.values(
      JSON.parse(secretValue.SecretString)
    )
  }

  return adminUsers
}
