import * as getJwtToken from '../../util/getJwtToken'
import * as doSearchRequest from '../../util/cmr/doSearchRequest'
import cmrGranuleSearch from '../handler'

describe('cmrGranuleSearch', () => {
  test('calls doSearchRequest', async () => {
    jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')

    const mock = jest.spyOn(doSearchRequest, 'doSearchRequest').mockImplementation(() => jest.fn())

    const event = {
      body: JSON.stringify({
        requestId: 'asdf-1234-qwer-5678',
        params: {}
      })
    }


    await cmrGranuleSearch(event, {})

    expect(mock).toBeCalledTimes(1)
    expect(mock).toBeCalledWith({
      jwtToken: 'mockJwt',
      path: '/search/granules.json',
      params: '',
      providedHeaders: {},
      requestId: 'asdf-1234-qwer-5678'
    })
  })
})
