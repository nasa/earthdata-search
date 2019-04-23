import { decodeUrlParams, encodeUrlQuery } from '../url'

import emptyDecodedResult from './url.test'

describe('url#decodeUrlParams', () => {
  test('decodes timelineQuery correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      timeline: {
        query: {
          end: '',
          interval: 'day',
          start: ''
        },
        state: {
          center: '1534577879'
        }
      }
    }
    expect(decodeUrlParams('?tl=1534577879%214%21%21')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  describe('timelineQuery', () => {
    test('encodes timelineQuery correctly when timeline is visible', () => {
      const props = {
        pathname: '/path/here',
        timeline: {
          collectionId: 'collectionId',
          state: {
            center: 1534577879
          },
          query: {
            interval: 'day'
          }
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?tl=1534577879%214%21%21')
    })

    test('encodes timelineQuery correctly when the timeline has no center state', () => {
      const props = {
        pathname: '/path/here',
        timeline: {
          collectionId: 'collectionId',
          state: {},
          query: {
            interval: 'day'
          }
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here')
    })

    test('encodes timelineQuery correctly when timeline is not visible', () => {
      const props = {
        pathname: '/path/here',
        timeline: {
          state: {
            center: 1534577879
          },
          query: {
            interval: 'day'
          }
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here')
    })
  })
})
