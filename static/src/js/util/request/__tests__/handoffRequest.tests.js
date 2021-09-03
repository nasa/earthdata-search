import HandoffRequest from '../handoffRequest'
import Request from '../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('HandoffRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const request = new HandoffRequest()

    expect(request.lambda).toBeTruthy()
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('HandoffRequest#fetchSotoLayers', () => {
  test('calls Request#get', () => {
    const request = new HandoffRequest()

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    request.fetchSotoLayers()

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('soto_layers')
  })
})
