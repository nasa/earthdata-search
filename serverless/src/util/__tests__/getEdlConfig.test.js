import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

import { getEdlConfig } from '../getEdlConfig'

import * as getEarthdataConfig from '../../../../sharedUtils/config'

jest.mock('@aws-sdk/client-secrets-manager', () => {
  const original = jest.requireActual('@aws-sdk/client-secrets-manager')

  const sendMock = jest.fn()
    .mockReturnValueOnce({
      SecretString: '{"id":"prodTest","secret":"prodSecret"}'
    })
    .mockReturnValueOnce({
      SecretString: '{"id":"uatTest","secret":"uatSecret"}'
    })

  return {
    ...original,
    SecretsManagerClient: jest.fn().mockImplementation(() => ({
      send: sendMock
    }))
  }
})

const client = new SecretsManagerClient()

describe('getEdlConfig', () => {
  test('fetches urs credentials from secrets manager', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      edlHost: 'http://urs.example.com'
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

    expect(client.send).toHaveBeenCalledTimes(1)
    expect(client.send).toHaveBeenCalledWith(expect.objectContaining({
      input: {
        SecretId: 'UrsClientConfigSecret_prod'
      }
    }))

    jest.clearAllMocks()

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

    expect(client.send).toHaveBeenCalledTimes(1)
    expect(client.send).toHaveBeenCalledWith(expect.objectContaining({
      input: {
        SecretId: 'UrsClientConfigSecret_uat'
      }
    }))
  })
})
