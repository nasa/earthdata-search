import ProviderRequest from '../providerRequest'
import Request from '../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('ProviderRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new ProviderRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('ProviderRequest#all', () => {
  test('calls Request#get', () => {
    const token = '123'
    const request = new ProviderRequest(token)

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    request.all()

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('providers')
  })
})
