import * as getEdlConfig from '../../util/getEdlConfig'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

import edlLogin from '../handler'

describe('edlLogin', () => {
  test('successfully redirects a user to earthdata login', async () => {
    jest.spyOn(getEdlConfig, 'getEdlConfig').mockImplementationOnce(() => ({
      client: {
        id: 'edlClientId'
      }
    }))

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      edlHost: 'http://edl.example.com',
      redirectUriPath: '/search'
    }))

    const response = await edlLogin({
      queryStringParameters: {
        state: 'http://edsc-state.nasa.gov'
      }
    })

    expect(response).toEqual({
      statusCode: 307,
      headers: {
        Location: 'http://edl.example.com/oauth/authorize?response_type=code&client_id=edlClientId&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsearch&state=http%3A%2F%2Fedsc-state.nasa.gov'
      }
    })
  })
})
