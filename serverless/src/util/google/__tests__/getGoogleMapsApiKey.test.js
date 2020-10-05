import AWS from 'aws-sdk'

import { getGoogleMapsApiKey } from '../getGoogleMapsApiKey'

import * as cmrEnv from '../../../../../sharedUtils/cmrEnv'

describe('getGoogleMapsApiKey', () => {
  test('fetches urs credentials from secrets manager', async () => {
    const secretsManagerData = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        SecretString: '{"key":"fake-api-key"}'
      })
    })

    AWS.SecretsManager = jest.fn()
      .mockImplementationOnce(() => ({
        getSecretValue: secretsManagerData
      }))

    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    const response = await getGoogleMapsApiKey()

    expect(response).toEqual({
      key: 'fake-api-key'
    })

    expect(secretsManagerData).toBeCalledTimes(1)
    expect(secretsManagerData.mock.calls[0]).toEqual([{
      SecretId: 'GoogleMapsApiKey'
    }])
  })
})
