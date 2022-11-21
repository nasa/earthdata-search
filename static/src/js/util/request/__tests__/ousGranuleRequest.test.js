import OusGranuleRequest from '../ousGranuleRequest'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('OusGranuleRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new OusGranuleRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
    expect(request.searchPath).toEqual('granules/ous')
  })
})

describe('OusGranuleRequest#permittedCmrKeys', () => {
  test('returns an array of collection CMR keys', () => {
    const request = new OusGranuleRequest(undefined, 'prod')

    expect(request.permittedCmrKeys()).toEqual([
      'bounding_box',
      'echo_collection_id',
      'exclude_granules',
      'granules',
      'format',
      'page_num',
      'page_size',
      'temporal',
      'variables'
    ])
  })
})
