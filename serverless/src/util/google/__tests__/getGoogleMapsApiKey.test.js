import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

import { getGoogleMapsApiKey } from '../getGoogleMapsApiKey'

jest.mock('@aws-sdk/client-secrets-manager', () => {
  const original = jest.requireActual('@aws-sdk/client-secrets-manager')
  const sendMock = jest.fn().mockReturnValueOnce({
    SecretString: '{"key":"fake-api-key"}'
  })

  return {
    ...original,
    SecretsManagerClient: jest.fn().mockImplementation(() => ({
      send: sendMock
    }))
  }
})

const client = new SecretsManagerClient()

describe('getGoogleMapsApiKey', () => {
  test('fetches urs credentials from secrets manager', async () => {
    const response = await getGoogleMapsApiKey('prod')

    expect(response).toEqual({
      key: 'fake-api-key'
    })

    expect(client.send).toBeCalledTimes(1)
    expect(client.send).toHaveBeenCalledWith(
      { SecretId: 'GoogleMapsApiKey' }
    )
  })
})