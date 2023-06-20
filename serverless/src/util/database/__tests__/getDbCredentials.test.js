import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

import { getDbCredentials } from '../getDbCredentials'

import * as deployedEnvironment from '../../../../../sharedUtils/deployedEnvironment'

const OLD_ENV = process.env

jest.mock('@aws-sdk/client-secrets-manager', () => {
  const original = jest.requireActual('@aws-sdk/client-secrets-manager')
  const sendMock = jest.fn().mockReturnValueOnce({
    SecretString: '{"username":"fake-username", "password":"fake-pw"}'
  })

  return {
    ...original,
    SecretsManagerClient: jest.fn().mockImplementation(() => ({
      send: sendMock
    }))
  }
})

const client = new SecretsManagerClient()

describe('getDbCredentials', () => {
  beforeEach(() => {
    // Manage resetting ENV variables
    jest.resetModules()
    process.env = { ...OLD_ENV }
    delete process.env.NODE_ENV
  })

  afterEach(() => {
    // Restore any ENV variables overwritten in tests
    process.env = OLD_ENV
  })

  test('fetches urs credentials from secrets manager', async () => {
    process.env.configSecretId = 'test-DbPasswordSecret'

    jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')

    const response = await getDbCredentials()

    expect(response).toEqual({
      username: 'fake-username',
      password: 'fake-pw'
    })

    expect(client.send).toBeCalledTimes(1)
    expect(client.send).toHaveBeenCalledWith(
      { SecretId: 'test-DbPasswordSecret' }
    )
  })
})