import RetrievalsMetricsRequest from '../retrievalsMetricsRequest'
import Request from '../../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('retrievalsMetricsRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new RetrievalsMetricsRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.edlToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('retrievalsMetricsRequest#transformResponse', () => {
  beforeEach(() => {
    jest.spyOn(RetrievalsMetricsRequest.prototype, 'handleUnauthorized').mockImplementation()
  })

  test('returns data if response is not successful', () => {
    const request = new RetrievalsMetricsRequest()

    const data = {
      statusCode: 404
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})

describe('retrievalsMetricsRequest#all', () => {
  test('calls Request#get', () => {
    const token = '123'
    const request = new RetrievalsMetricsRequest(token)

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    request.all({ mock: 'params' })

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('admin/retrievals_metrics', { mock: 'params' })
  })
})
