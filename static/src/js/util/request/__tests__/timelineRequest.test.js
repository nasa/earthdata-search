import TimelineRequest from '../timelineRequest'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('TimelineRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new TimelineRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3001')
    expect(request.searchPath).toEqual('granules/timeline')
  })

  test('sets the default values when unauthenticated', () => {
    const request = new TimelineRequest()

    expect(request.authenticated).toBeFalsy()
    expect(request.baseUrl).toEqual('https://cmr.earthdata.nasa.gov')
    expect(request.searchPath).toEqual('search/granules/timeline')
  })
})

describe('TimelineRequest#permittedCmrKeys', () => {
  test('returns an array of timeline CMR keys', () => {
    const request = new TimelineRequest()

    expect(request.permittedCmrKeys()).toEqual([
      'echo_collection_id',
      'end_date',
      'interval',
      'start_date'
    ])
  })
})
