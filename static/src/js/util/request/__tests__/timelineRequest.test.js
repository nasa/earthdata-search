import TimelineRequest from '../timelineRequest'
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

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
    expect(request.baseUrl).toEqual('http://localhost:3000')
    expect(request.searchPath).toEqual('granules/timeline')
  })

  test('sets the default values when unauthenticated', () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

    const request = new TimelineRequest(undefined, 'prod')

    expect(request.authenticated).toBeFalsy()
    expect(request.baseUrl).toEqual('https://cmr.earthdata.nasa.gov')
    expect(request.searchPath).toEqual('search/granules/timeline')
  })
})

describe('TimelineRequest#permittedCmrKeys', () => {
  test('returns an array of timeline CMR keys', () => {
    const request = new TimelineRequest(undefined, 'prod')

    expect(request.permittedCmrKeys()).toEqual([
      'concept_id',
      'end_date',
      'interval',
      'start_date'
    ])
  })
})

describe('TimelineRequest#nonIndexedKeys', () => {
  test('returns an array of timeline CMR keys', () => {
    const request = new TimelineRequest(undefined, 'prod')

    expect(request.nonIndexedKeys()).toEqual([
      'concept_id'
    ])
  })
})
