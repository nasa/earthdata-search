import MetricsPreferencesRequest from '../metricsPreferencesRequest'
import Request from '../../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('metricsPreferencesRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new MetricsPreferencesRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('metricsPreferencesRequest#transformResponse', () => {
  beforeEach(() => {
    jest.spyOn(MetricsPreferencesRequest.prototype, 'handleUnauthorized').mockImplementation()
  })

  test('returns data if response is not successful', () => {
    const request = new MetricsPreferencesRequest()

    const data = {
      statusCode: 404
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})

describe('metricsPreferencesRequest#all', () => {
  test('calls Request#get', () => {
    const token = '123'
    const request = new MetricsPreferencesRequest(token)

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    request.all()

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('admin/preferences_metrics')
  })
})
