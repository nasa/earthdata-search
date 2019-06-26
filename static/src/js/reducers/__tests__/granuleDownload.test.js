import updateGranuleDownloadParamsReducer from '../granuleDownload'
import {
  UPDATE_GRANULE_DOWNLOAD_PARAMS,
  UPDATE_GRANULE_LINKS
} from '../../constants/actionTypes'

const initialState = {
  granuleDownloadParams: {},
  granuleDownloadLinks: []
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(updateGranuleDownloadParamsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_GRANULE_DOWNLOAD_PARAMS', () => {
  test('returns the correct state when no data has been provided', () => {
    const action = {
      type: UPDATE_GRANULE_DOWNLOAD_PARAMS,
      payload: {
        id: 1,
        collection_id: 'C1000005-EDSC'
      }
    }

    const expectedState = {
      ...initialState,
      granuleDownloadParams: {
        id: 1,
        collection_id: 'C1000005-EDSC'
      }
    }

    expect(updateGranuleDownloadParamsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('UPDATE_GRANULE_LINKS', () => {
  test('returns the correct state when no data has been provided', () => {
    const action = {
      type: UPDATE_GRANULE_LINKS,
      payload: ['http://google.jp']
    }

    const expectedState = {
      ...initialState,
      granuleDownloadLinks: ['http://google.jp']
    }

    expect(updateGranuleDownloadParamsReducer(undefined, action)).toEqual(expectedState)
  })

  test('returns the correct state when data has been provided', () => {
    const action = {
      type: UPDATE_GRANULE_LINKS,
      payload: ['http://google.jp']
    }

    const initial = {
      ...initialState,
      granuleDownloadLinks: [
        'http://google.com'
      ]
    }

    const expectedState = {
      ...initial,
      granuleDownloadLinks: [
        'http://google.com',
        'http://google.jp'
      ]
    }

    expect(updateGranuleDownloadParamsReducer(initial, action)).toEqual(expectedState)
  })
})
