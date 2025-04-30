import Request from '../request'

const baseUrl = 'http://example.com'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('Request#constructor', () => {
  test('sets the default values', () => {
    const request = new Request(baseUrl, 'prod')

    expect(request.authenticated).toBeFalsy()
    expect(request.baseUrl).toEqual(baseUrl)
    expect(request.lambda).toBeFalsy()
    expect(request.searchPath).toEqual('')
  })

  test('throws an error when no baseUrl value is provided', () => {
    expect(() => {
      // @ts-expect-error Not enough arguments
      Request()
    }).toThrow()
  })
})

describe('Request#getAuthToken', () => {
  test('returns the auth token', () => {
    const request = new Request(baseUrl, 'prod')
    request.authToken = 'test auth token'

    expect(request.getAuthToken()).toEqual('test auth token')
  })

  test('returns an empty string if optionallyAuthenticated', () => {
    const request = new Request(baseUrl, 'prod')

    request.optionallyAuthenticated = true

    expect(request.getAuthToken()).toEqual('')
  })
})

describe('Request#transformRequest', () => {
  test('adds authorization header when authenticated', () => {
    const request = new Request(baseUrl, 'prod')
    const token = '123'

    request.authenticated = true
    request.authToken = token

    const data = { param1: 123 }
    const headers = {}

    request.transformRequest(data, headers)

    expect(headers).toEqual(expect.objectContaining({
      Authorization: 'Bearer 123'
    }))
  })
})

describe('Request#transformResponse', () => {
  test('calls handleUnauthorized and returns data', () => {
    const request = new Request(baseUrl, 'prod')

    const handleUnauthorizedMock = jest.spyOn(Request.prototype, 'handleUnauthorized').mockImplementation()

    const data = {
      data: {
        param1: 123
      },
      statusCode: 200,
      message: 'OK',
      headers: {}
    }
    const result = request.transformResponse(data)

    expect(result).toEqual({
      data: {
        param1: 123
      },
      statusCode: 200,
      message: 'OK',
      headers: {}
    })

    expect(handleUnauthorizedMock).toHaveBeenCalledTimes(1)
    expect(handleUnauthorizedMock).toHaveBeenCalledWith(data)
  })
})

describe('Request#search', () => {
  test('calls Request#post', () => {
    const request = new Request(baseUrl, 'prod')

    const postMock = jest.spyOn(Request.prototype, 'post').mockImplementation()

    const params = {
      param1: 12,
      ext: 'json'
    }
    request.search(params)

    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith('', params)
  })
})

describe('Request#handleUnauthorized', () => {
  const originalWindowLocation = window.location

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: new URL(window.location.href)
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: originalWindowLocation
    })
  })

  test('redirects if the response is unauthorized', () => {
    const request = new Request(baseUrl, 'prod')
    const data = {
      data: {},
      statusCode: 401,
      message: 'Unauthorized',
      headers: {}
    }
    const returnPath = 'http://example.com/test/path'

    window.location.href = returnPath

    request.handleUnauthorized(data)
    expect(window.location.href).toEqual(`http://localhost:3000/login?ee=prod&state=${encodeURIComponent(returnPath)}`)
  })

  test('does not redirect if the response is valid', () => {
    const request = new Request(baseUrl, 'prod')

    const beforeHref = window.location.href

    request.handleUnauthorized({
      data: {},
      statusCode: 200,
      message: 'OK',
      headers: {}
    })

    expect(window.location.href).toEqual(beforeHref)
  })
})
