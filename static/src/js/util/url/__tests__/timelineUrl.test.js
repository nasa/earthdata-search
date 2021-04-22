import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeUrlParams', () => {
  test('decodes timelineQuery correctly without a focused date', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      timeline: {
        center: 1534577879000,
        end: undefined,
        interval: 'day',
        start: undefined
      }
    }
    expect(decodeUrlParams('?tl=1534577879!2!!')).toEqual(expectedResult)
  })

  test('decodes timelineQuery correctly with a focused date', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      timeline: {
        center: 1546300800000,
        end: 1548979199000,
        interval: 'day',
        start: 1546300800000
      }
    }
    expect(decodeUrlParams('?tl=1546300800!2!1546300800!1548979199')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  describe('timelineQuery', () => {
    test('encodes timelineQuery correctly when timeline is visible', () => {
      const props = {
        hasGranulesOrCwic: true,
        pathname: '/path/here',
        timelineQuery: {
          center: 1534577879000,
          interval: 'day'
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?tl=1534577879!2!!')
    })

    test('encodes timelineQuery correctly when the timeline has no center state', () => {
      const props = {
        hasGranulesOrCwic: true,
        pathname: '/path/here',
        timelineQuery: {
          interval: 'day'
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here')
    })

    test('does not encode timelineQuery when timeline is not visible', () => {
      const props = {
        hasGranulesOrCwic: true,
        pathname: '/search',
        timelineQuery: {
          center: 1534577879,
          interval: 'day'
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/search')
    })
  })
})
