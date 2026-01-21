import LoggerRequest from '../loggerRequest'
import Request from '../request'

describe('LoggerRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const request = new LoggerRequest()

    expect(request.lambda).toBeTruthy()
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('LoggerRequest#log', () => {
  test('calls Request#post', () => {
    const request = new LoggerRequest()

    const postMock = vi.spyOn(Request.prototype, 'post').mockImplementation()

    const params = { error: { mock: 'error' } }
    request.log(params)

    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith('error_logger', params)
  })
})

describe('LoggerRequest#alert', () => {
  test('calls Request#post', () => {
    const request = new LoggerRequest()

    const postMock = vi.spyOn(Request.prototype, 'post').mockImplementation()

    const params = { error: { mock: 'error' } }
    request.alert(params)

    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith('alert_logger', params)
  })
})

describe('LoggerRequest#logRelevancy', () => {
  test('calls Request#post', () => {
    const request = new LoggerRequest()

    const postMock = vi.spyOn(Request.prototype, 'post').mockImplementation()

    const params = { data: { mock: 'data' } }
    request.logRelevancy(params)

    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith('relevancy_logger', params)
  })
})
