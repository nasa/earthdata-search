import TimelineRequest from '../timelineRequest'

// @ts-expect-error Types are not defined for this module
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

vi.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

describe('TimelineRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new TimelineRequest(token, 'prod')

    expect(request.authenticated).toBeTruthy()
    expect(request.edlToken).toEqual(token)
    expect(request.baseUrl).toEqual('https://cmr.earthdata.nasa.gov')
    expect(request.searchPath).toEqual('search/granules/timeline')
  })

  test('sets the default values when unauthenticated', () => {
    const request = new TimelineRequest(null, 'prod')

    expect(request.authenticated).toBeFalsy()
    expect(request.baseUrl).toEqual('https://cmr.earthdata.nasa.gov')
    expect(request.searchPath).toEqual('search/granules/timeline')
  })
})

describe('TimelineRequest#permittedCmrKeys', () => {
  test('returns an array of timeline CMR keys', () => {
    const request = new TimelineRequest(null, 'prod')

    expect(request.permittedCmrKeys()).toEqual([
      'bounding_box',
      'concept_id',
      'end_date',
      'interval',
      'point',
      'polygon',
      'start_date'
    ])
  })
})

describe('TimelineRequest#nonIndexedKeys', () => {
  test('returns an array of timeline CMR keys', () => {
    const request = new TimelineRequest(null, 'prod')

    expect(request.nonIndexedKeys()).toEqual([
      'bounding_box',
      'concept_id',
      'point',
      'polygon'
    ])
  })
})
