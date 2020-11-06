import Request from '../request'

const baseUrl = 'http://example.com'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('Request#constructor', () => {
  test('sets the default values', () => {
    const request = new Request(baseUrl)

    expect(request.authenticated).toBeFalsy()
    expect(request.baseUrl).toEqual(baseUrl)
    expect(request.lambda).toBeFalsy()
    expect(request.searchPath).toEqual('')
  })

  test('throws an error when no baseUrl value is provided', () => {
    expect(() => {
      Request()
    }).toThrow()
  })
})

describe('Request#getAuthToken', () => {
  test('returns the auth token', () => {
    const request = new Request(baseUrl)
    request.authToken = 'test auth token'

    expect(request.getAuthToken()).toEqual('test auth token')
  })

  test('returns an empty string if optionallyAuthenticated', () => {
    const request = new Request(baseUrl)

    request.optionallyAuthenticated = true

    expect(request.getAuthToken()).toEqual('')
  })
})

describe('Request#transformRequest', () => {
  test('adds authorization header when authenticated', () => {
    const request = new Request(baseUrl)
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
    const request = new Request(baseUrl)

    const handleUnauthorizedMock = jest.spyOn(Request.prototype, 'handleUnauthorized').mockImplementation()

    const data = { param1: 123 }
    const result = request.transformResponse(data)

    expect(result).toEqual({ param1: 123 })

    expect(handleUnauthorizedMock).toBeCalledTimes(1)
    expect(handleUnauthorizedMock).toBeCalledWith(data)
  })
})

describe('Request#search', () => {
  test('calls Request#post', () => {
    const request = new Request(baseUrl)

    const postMock = jest.spyOn(Request.prototype, 'post').mockImplementation()

    const params = { param1: 12, ext: 'json' }
    request.search(params)

    expect(postMock).toBeCalledTimes(1)
    expect(postMock).toBeCalledWith('', params)
  })
})

describe('Request#handleUnauthorized', () => {
  const { href } = window.location

  afterEach(() => {
    jest.clearAllMocks()
    window.location.href = href
  })

  test('redirects if the response is unauthorized', () => {
    const request = new Request(baseUrl, 'prod')
    const data = {
      statusCode: 401
    }
    const returnPath = 'http://example.com/test/path'

    delete window.location
    window.location = { href: returnPath, pathname: '' }

    request.handleUnauthorized(data)
    expect(window.location.href).toEqual(`http://localhost:3000/login?ee=prod&state=${encodeURIComponent(returnPath)}`)
  })

  test('does not redirect if the response is valid', () => {
    const request = new Request(baseUrl, 'prod')

    delete window.location
    window.location = { href: jest.fn() }

    request.handleUnauthorized({})

    expect(window.location.href.mock.calls.length).toBe(0)
  })
})
