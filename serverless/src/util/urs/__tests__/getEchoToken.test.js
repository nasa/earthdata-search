import * as getAccessTokenFromJwtToken from '../getAccessTokenFromJwtToken'
import * as getEdlConfig from '../../getEdlConfig'

import { getEchoToken } from '../getEchoToken'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEdlConfig, 'getEdlConfig').mockImplementation(() => ({
    client: {
      id: 'clientId'
    }
  }))

  jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'access_token' }))
})

describe('getEchoToken', () => {
  test('returns an echo token with environment specific client id', async () => {
    const response = await getEchoToken()

    expect(response).toEqual('access_token:clientId')
  })
})
