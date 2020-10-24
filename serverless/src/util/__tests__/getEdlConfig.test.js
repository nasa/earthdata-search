import AWS from 'aws-sdk'

import { getEdlConfig } from '../getEdlConfig'

import * as getEarthdataConfig from '../../../../sharedUtils/config'

describe('getEdlConfig', () => {
  test('fetches urs credentials from secrets manager', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      edlHost: 'http://urs.example.com'
    }))

    const prodSecretsManagerData = {
      promise: jest.fn().mockResolvedValue({
        SecretString: '{"id":"prodTest","secret":"prodSecret"}'
      })
    }
    const uatSecretsManagerData = {
      promise: jest.fn().mockResolvedValue({
        SecretString: '{"id":"uatTest","secret":"uatSecret"}'
      })
    }

    AWS.SecretsManager = jest.fn(() => ({
      getSecretValue: jest.fn()
        .mockImplementationOnce(() => (prodSecretsManagerData))
        .mockImplementationOnce(() => (uatSecretsManagerData))
    }))

    const prodResponse = await getEdlConfig('prod')

    expect(prodResponse).toEqual({
      auth: {
        tokenHost: 'http://urs.example.com'
      },
      client: {
        id: 'prodTest',
        secret: 'prodSecret'
      }
    })

    expect(prodSecretsManagerData.promise).toBeCalledTimes(1)

    // call getEdlConfig again for a different value to ensure the cached value isn't being passed for the new env
    const uatResponse = await getEdlConfig('uat')

    expect(uatResponse).toEqual({
      auth: {
        tokenHost: 'http://urs.example.com'
      },
      client: {
        id: 'uatTest',
        secret: 'uatSecret'
      }
    })

    expect(uatSecretsManagerData.promise).toBeCalledTimes(1)
  })
})
