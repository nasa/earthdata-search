import RegionRequest from '../regionRequest'
import Request from '../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('RegionRequest#constructor', () => {
  test('sets the default values', () => {
    const request = new RegionRequest()

    expect(request.authenticated).toBeFalsy()
    expect(request.lambda).toBeTruthy()
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('RegionRequest#transformResponse', () => {
  beforeEach(() => {
    jest.spyOn(RegionRequest.prototype, 'handleUnauthorized').mockImplementation()
  })

  test('returns data if response is not successful', () => {
    const request = new RegionRequest()

    const data = {
      statusCode: 404
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})

describe('RegionRequest#search', () => {
  test('calls Request#get', () => {
    const request = new RegionRequest()

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    request.search({
      endpoint: 'region',
      query: 'California',
      exact: false
    })

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('regions', {
      endpoint: 'region',
      query: 'California',
      exact: false
    })
  })
})
