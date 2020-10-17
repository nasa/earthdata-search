import AWS from 'aws-sdk'

import { getEdlConfig } from '../getEdlConfig'

import * as cmrEnv from '../../../../sharedUtils/cmrEnv'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

describe('getEdlConfig', () => {
  test('fetches urs credentials from secrets manager', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      edlHost: 'http://urs.example.com'
    }))

    const secretsManagerData = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        SecretString: '{"id":"test","secret":"secret"}'
      })
    })

    AWS.SecretsManager = jest.fn()
      .mockImplementationOnce(() => ({
        getSecretValue: secretsManagerData
      }))

    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    const response = await getEdlConfig()

    expect(response).toEqual({
      auth: {
        tokenHost: 'http://urs.example.com'
      },
      client: {
        id: 'test',
        secret: 'secret'
      }
    })

    expect(secretsManagerData).toBeCalledTimes(1)
    expect(secretsManagerData.mock.calls[0]).toEqual([{
      SecretId: 'UrsClientConfigSecret_prod'
    }])
  })
})
