import LoggerRequest from '../loggerRequest'
import Request from '../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('LoggerRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const request = new LoggerRequest()

    expect(request.lambda).toBeTruthy()
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('LoggerRequest#permittedCmrKeys', () => {
  test('returns an array of timeline CMR keys', () => {
    const request = new LoggerRequest()

    expect(request.permittedCmrKeys()).toEqual([
      'error',
      'data'
    ])
  })
})

describe('LoggerRequest#log', () => {
  test('calls Request#post', () => {
    const request = new LoggerRequest()

    const postMock = jest.spyOn(Request.prototype, 'post').mockImplementation()

    const params = { error: { mock: 'error' } }
    request.log(params)

    expect(postMock).toBeCalledTimes(1)
    expect(postMock).toBeCalledWith('error_logger', params)
  })
})

describe('LoggerRequest#logRelevancy', () => {
  test('calls Request#post', () => {
    const request = new LoggerRequest()

    const postMock = jest.spyOn(Request.prototype, 'post').mockImplementation()

    const params = { data: { mock: 'data' } }
    request.logRelevancy(params)

    expect(postMock).toBeCalledTimes(1)
    expect(postMock).toBeCalledWith('relevancy_logger', params)
  })
})

describe('LoggerRequest#logSelectedAutocomplete', () => {
  test('calls Request#post', () => {
    const request = new LoggerRequest()

    const postMock = jest.spyOn(Request.prototype, 'post').mockImplementation()

    const params = { data: { mock: 'data' } }
    request.logSelectedAutocomplete(params)

    expect(postMock).toBeCalledTimes(1)
    expect(postMock).toBeCalledWith('autocomplete_logger', params)
  })
})
