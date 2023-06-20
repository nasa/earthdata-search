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

    expect(client.send).toBeCalledWith({ SecretId: 'UrsClientConfigSecret_prod' })

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

    expect(client.send).toBeCalledWith({ SecretId: 'UrsClientConfigSecret_uat' })
    expect(client.send).toBeCalledTimes(2)
  })
})