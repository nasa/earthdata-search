import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

import { getAdminUsers } from '../getAdminUsers'

vi.mock('@aws-sdk/client-secrets-manager', async () => {
  const original = await vi.importActual('@aws-sdk/client-secrets-manager')
  const sendMock = vi.fn().mockReturnValueOnce({
    SecretString: '["testuser1","testuser2"]'
  })

  return {
    ...original,
    SecretsManagerClient: vi.fn(class {
      send = sendMock
    })
  }
})

const client = new SecretsManagerClient()

describe('getAdminUsers', () => {
  test('fetches admin credentials from secrets manager', async () => {
    const response = await getAdminUsers()

    expect(response).toEqual(['testuser1', 'testuser2'])

    expect(client.send).toHaveBeenCalledTimes(1)
    expect(client.send).toHaveBeenCalledWith(expect.objectContaining({
      input: {
        SecretId: 'EDSC_Admins'
      }
    }))
  })
})
