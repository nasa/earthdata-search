import conceptMetadata from '../handler'
import * as getAccessTokenFromJwtToken from '../../util/urs/getAccessTokenFromJwtToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('conceptMetadata', () => {
  test('returns a redirect', async () => {
    jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'access_token' }))
    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ clientId: 'clientId' }))

    const event = {
      queryStringParameters: {
        url: 'http://example.com/concepts',
        token: 'mockToken'
      }
    }

    const result = await conceptMetadata(event)

    expect(result.headers).toEqual({ Location: 'http://example.com/concepts?token=access_token:clientId' })
    expect(result.statusCode).toBe(307)
  })

  test('returns a redirect correctly when the provided url has query params', async () => {
    jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'access_token' }))
    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ clientId: 'clientId' }))

    const event = {
      queryStringParameters: {
        url: 'http://example.com/concepts?id=42',
        token: 'mockToken'
      }
    }

    const result = await conceptMetadata(event)

    expect(result.headers).toEqual({ Location: 'http://example.com/concepts?id=42&token=access_token:clientId' })
    expect(result.statusCode).toBe(307)
  })

  test('correctly returns false when the warmUp payload is received', async () => {
    const payload = {
      source: 'serverless-plugin-warmup'
    }

    const response = await conceptMetadata(payload, {})

    expect(response).toEqual(false)
  })
})
