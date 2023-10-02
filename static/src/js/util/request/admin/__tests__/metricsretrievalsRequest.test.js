import MetricsRetrievalsRequest from '../metricsRetrievalsRequest'
import Request from '../../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('metricsRetrievalsRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new MetricsRetrievalsRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('metricsRetrievalsRequest#transformResponse', () => {
  beforeEach(() => {
    jest.spyOn(MetricsRetrievalsRequest.prototype, 'handleUnauthorized').mockImplementation()
  })

  test('returns data if response is not successful', () => {
    const request = new MetricsRetrievalsRequest()

    const data = {
      statusCode: 404
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})

describe('metricsRetrievalsRequest#all', () => {
  test('calls Request#get', () => {
    const token = '123'
    const request = new MetricsRetrievalsRequest(token)

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    request.all({ mock: 'params' })

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('admin/retrievalsMetrics', { mock: 'params' })
  })
})
