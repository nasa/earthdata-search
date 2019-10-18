import * as getJwtToken from '../../util/getJwtToken'
import * as doSearchRequest from '../../util/cmr/doSearchRequest'
import collectionSearch from '../handler'

describe('collectionSearch', () => {
  test('calls doSearchRequest', async () => {
    jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')

    const mock = jest.spyOn(doSearchRequest, 'doSearchRequest').mockImplementation(() => jest.fn())

    const event = {
      body: JSON.stringify({
        params: {}
      }),
      pathParameters: {
        format: 'json'
      }
    }

    await collectionSearch(event, {})

    expect(mock).toBeCalledTimes(1)
    expect(mock).toBeCalledWith('mockJwt', '/search/collections.json', '', {})
  })
})
