import updateGranuleDownloadParamsReducer from '../granuleDownload'
import {
  UPDATE_GRANULE_LINKS
} from '../../constants/actionTypes'

const initialState = {
  isLoaded: false,
  isLoading: false
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(updateGranuleDownloadParamsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_GRANULE_LINKS', () => {
  test('returns the correct state when no data has been provided', () => {
    const action = {
      type: UPDATE_GRANULE_LINKS,
      payload: {
        id: 1,
        percentDone: '100',
        links: {
          download: ['http://google.jp']
        }
      }
    }

    const expectedState = {
      1: {
        percentDone: '100',
        links: {
          download: ['http://google.jp'],
          s3: []
        }
      },
      isLoaded: false,
      isLoading: false
    }

    expect(updateGranuleDownloadParamsReducer(undefined, action)).toEqual(expectedState)
  })

  test('returns the correct state when data has been provided', () => {
    const action = {
      type: UPDATE_GRANULE_LINKS,
      payload: {
        id: 1,
        percentDone: '100',
        links: {
          download: ['http://google.jp']
        }
      }
    }

    const initial = {
      1: {
        percentDone: '50',
        links: {
          download: [
            'http://google.com'
          ],
          s3: []
        }
      }
    }

    const expectedState = {
      1: {
        percentDone: '100',
        links: {
          download: [
            'http://google.com',
            'http://google.jp'
          ],
          s3: []
        }
      }
    }

    expect(updateGranuleDownloadParamsReducer(initial, action)).toEqual(expectedState)
  })

  describe('when s3 links are provided', () => {
    test('returns the correct state', () => {
      const action = {
        type: UPDATE_GRANULE_LINKS,
        payload: {
          id: 1,
          percentDone: '100',
          links: {
            download: ['http://google.jp'],
            s3: ['s3://google.jp']
          }
        }
      }

      const initial = {
        1: {
          percentDone: '50',
          links: {
            download: [
              'http://google.com'
            ],
            s3: [
              's3://google.com'
            ]
          }
        }
      }

      const expectedState = {
        1: {
          percentDone: '100',
          links: {
            download: [
              'http://google.com',
              'http://google.jp'
            ],
            s3: [
              's3://google.com',
              's3://google.jp'
            ]
          }
        }
      }

      expect(updateGranuleDownloadParamsReducer(initial, action)).toEqual(expectedState)
    })
  })
})
