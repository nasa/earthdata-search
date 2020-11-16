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
        ee: 'prod',
        state: 'http://edsc-state.nasa.gov'
      }
    })

    expect(response).toEqual({
      statusCode: 307,
      headers: {
        Location: 'http://edl.example.com/oauth/authorize?response_type=code&client_id=edlClientId&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsearch&state=http%3A%2F%2Fedsc-state.nasa.gov%3Fee%3Dprod'
      }
    })
  })

  test('successfully keeps array values in order during the redirect to earthdata login', async () => {
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
        ee: 'prod',
        state: 'http://edsc-state.nasa.gov?p=!C12345-EDSC&p[1][v]=t'
      }
    })

    expect(response).toEqual({
      statusCode: 307,
      headers: {
        Location: 'http://edl.example.com/oauth/authorize?response_type=code&client_id=edlClientId&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsearch&state=http%3A%2F%2Fedsc-state.nasa.gov%3Fp%255B0%255D%3D%2521C12345-EDSC%26p%255B1%255D%255B1%255D%255Bv%255D%3Dt%26ee%3Dprod'
      }
    })
  })
})
