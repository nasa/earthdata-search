import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

import { getAdminUsers } from '../getAdminUsers'

jest.mock('@aws-sdk/client-secrets-manager', () => {
  const original = jest.requireActual('@aws-sdk/client-secrets-manager')
  const sendMock = jest.fn().mockReturnValueOnce({
    SecretString: '["testuser1","testuser2"]'
  })

  return {
    ...original,
    SecretsManagerClient: jest.fn().mockImplementation(() => ({
      send: sendMock
    }))
  }
})

const client = new SecretsManagerClient()

describe('getAdminUsers', () => {
  test('fetches admin credentials from secrets manager', async () => {
    const response = await getAdminUsers()

    expect(response).toEqual(['testuser1', 'testuser2'])

    expect(client.send).toBeCalledTimes(1)
    expect(client.send).toHaveBeenCalledWith(expect.objectContaining({
      input: {
        SecretId: 'EDSC_Admins'
      }
    }))
  })
})
