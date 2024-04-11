import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'

import { getSecretAdminUsers } from '../../../sharedUtils/config'
import { getSecretsManagerConfig } from './aws/getSecretsManagerConfig'

let adminUsers
let secretsManagerClient

/**
 * Retrieve a list of users authorized to access the admin dashboard
 */
export const getAdminUsers = async () => {
  if (adminUsers == null) {
    if (secretsManagerClient == null) {
      secretsManagerClient = new SecretsManagerClient(getSecretsManagerConfig())
    }

    if (process.env.NODE_ENV === 'development') {
      adminUsers = getSecretAdminUsers()

      return adminUsers
    }

    const params = {
      SecretId: 'EDSC_Admins'
    }

    const command = new GetSecretValueCommand(params)
    const secretValue = await secretsManagerClient.send(command)

    // Secrets Manager requires key/value pairs, so AWS converts an array to an indexed object
    adminUsers = Object.values(
      JSON.parse(secretValue.SecretString)
    )
  }

  return adminUsers
}
