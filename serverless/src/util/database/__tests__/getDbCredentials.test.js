import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

import { getDbCredentials } from '../getDbCredentials'

import * as deployedEnvironment from '../../../../../sharedUtils/deployedEnvironment'

const OLD_ENV = process.env

vi.mock('@aws-sdk/client-secrets-manager', async () => {
  const original = await vi.importActual('@aws-sdk/client-secrets-manager')
  const sendMock = vi.fn().mockReturnValueOnce({
    SecretString: '{"username":"fake-username", "password":"fake-pw"}'
  })

  return {
    ...original,
    SecretsManagerClient: vi.fn(class {
      send = sendMock
    })
  }
})

const client = new SecretsManagerClient()

describe('getDbCredentials', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV }
    delete process.env.NODE_ENV
  })

  afterEach(() => {
    // Restore any ENV variables overwritten in tests
    process.env = OLD_ENV
  })

  test('fetches urs credentials from secrets manager', async () => {
    process.env.CONFIG_SECRET_ID = 'test-DbPasswordSecret'

    vi.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')

    const response = await getDbCredentials()

    expect(response).toEqual({
      username: 'fake-username',
      password: 'fake-pw'
    })

    expect(client.send).toHaveBeenCalledTimes(1)
    expect(client.send).toHaveBeenCalledWith(expect.objectContaining({
      input: {
        SecretId: 'test-DbPasswordSecret'
      }
    }))
  })
})
