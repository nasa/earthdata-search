import AutocompleteRequest from '../autocompleteRequest'
import Request from '../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('AutocompleteRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new AutocompleteRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
    expect(request.searchPath).toEqual('autocomplete')
  })

  test('sets the default values', () => {
    const request = new AutocompleteRequest()

    expect(request.authenticated).toBeFalsy()
    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('AutocompleteRequest#permittedCmrKeys', () => {
  test('returns an array of permitted region keys', () => {
    const request = new AutocompleteRequest()

    expect(request.permittedCmrKeys()).toEqual([
      'type',
      'q'
    ])
  })
})

describe('AutocompleteRequest#nonIndexedKeys', () => {
  test('returns an array of permitted region keys', () => {
    const request = new AutocompleteRequest()

    expect(request.nonIndexedKeys()).toEqual([
      'type'
    ])
  })
})

describe('AutocompleteRequest#transformResponse', () => {
  beforeEach(() => {
    jest.spyOn(AutocompleteRequest.prototype, 'handleUnauthorized').mockImplementation()
  })

  test('returns data if response is not successful', () => {
    const request = new AutocompleteRequest()

    const data = {
      statusCode: 404
    }

    const result = request.transformResponse(data)

    expect(result).toEqual(data)
  })
})

describe('AutocompleteRequest#search', () => {
  test('calls Request#get', () => {
    const request = new AutocompleteRequest()

    const getMock = jest.spyOn(Request.prototype, 'post').mockImplementation()

    request.search({
      q: 'ICE'
    })

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('autocomplete', {
      q: 'ICE'
    })
  })
})
