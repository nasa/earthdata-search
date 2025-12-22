import { AxiosError } from 'axios'
import Request from '../request'
import { RequestResponseData } from '../../../types/sharedTypes'

const baseUrl = 'http://example.com'

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

describe('Request#getEdlToken', () => {
  test('returns the auth token', () => {
    const request = new Request(baseUrl, 'prod')
    request.edlToken = 'test auth token'

    expect(request.getEdlToken()).toEqual('test auth token')
  })

  test('returns an empty string if optionallyAuthenticated', () => {
    const request = new Request(baseUrl, 'prod')

    request.optionallyAuthenticated = true

    expect(request.getEdlToken()).toEqual('')
  })
})

describe('Request#transformRequest', () => {
  test('adds authorization header when authenticated', () => {
    const request = new Request(baseUrl, 'prod')
    const token = '123'

    request.authenticated = true
    request.edlToken = token

    const data = { conceptId: 'C123456-EDSC' }
    const headers = {}

    request.transformRequest(data, headers)

    expect(headers).toEqual(expect.objectContaining({
      Authorization: 'Bearer 123'
    }))
  })
})

describe('Request#transformResponse', () => {
  test('returns data', () => {
    const request = new Request(baseUrl, 'prod')

    const data: RequestResponseData = {
      feed: {
        entry: []
      }
    }
    const result = request.transformResponse(data)

    expect(result).toEqual(data)

    expect(window.dataLayer.push).toHaveBeenCalledTimes(1)
    expect(window.dataLayer.push).toHaveBeenCalledWith({
      event: 'timing',
      timingEventCategory: 'ajax',
      timingEventValue: expect.any(Number),
      timingEventVar: undefined
    })
  })
})

describe('Request#search', () => {
  test('calls Request#post', () => {
    const request = new Request(baseUrl, 'prod')

    const postMock = jest.spyOn(Request.prototype, 'post').mockImplementation()

    const params = {
      conceptId: 'C123456-EDSC'
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

    const returnPath = 'http://example.com/test/path'

    window.location.href = returnPath

    request.handleUnauthorized({
      response: {
        status: 401
      },
      message: 'Unauthorized',
      headers: {}
    } as unknown as AxiosError)

    expect(window.location.href).toEqual(`http://localhost:3000/login?ee=prod&state=${encodeURIComponent(returnPath)}`)
  })

  test('does not redirect if the response is valid', () => {
    const request = new Request(baseUrl, 'prod')

    const beforeHref = window.location.href

    request.handleUnauthorized({
      response: {
        status: 200
      },
      message: 'OK',
      headers: {}
    } as unknown as AxiosError)

    expect(window.location.href).toEqual(beforeHref)
  })
})
