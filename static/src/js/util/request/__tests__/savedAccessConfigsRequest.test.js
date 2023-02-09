import Request from '../request'
import SavedAccessConfigsRequest from '../savedAccessConfigsRequest'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('SavedAccessConfigsRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new SavedAccessConfigsRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
    expect(request.searchPath).toEqual('saved_access_configs')
  })
})

describe('SavedAccessConfigsRequest#get', () => {
  test('calls Request#get', () => {
    const token = '123'
    const request = new SavedAccessConfigsRequest(token)

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    const params = { mock: 'data' }
    request.get(params)

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('saved_access_configs', params)
  })
})
