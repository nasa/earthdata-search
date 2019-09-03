import RetrievalRequest from '../retrievalRequest'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('RetrievalRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new RetrievalRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('RetrievalRequest#permittedCmrKeys', () => {
  test('returns an array of timeline CMR keys', () => {
    const request = new RetrievalRequest()

    expect(request.permittedCmrKeys()).toEqual([
      'collections',
      'environment',
      'json_data'
    ])
  })
})

describe('RetrievalRequest#nonIndexedKeys', () => {
  test('returns an array of timeline CMR keys', () => {
    const request = new RetrievalRequest()

    expect(request.nonIndexedKeys()).toEqual([])
  })
})

describe('RetrievalRequest#transformResponse', () => {
  beforeEach(() => {
    jest.spyOn(RetrievalRequest.prototype, 'handleUnauthorized').mockImplementation()
  })

  test('returns data if response is not success', () => {
    const request = new RetrievalRequest()

    const data = {
      statusCode: 404
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})
