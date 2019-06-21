import updateGranuleDownloadParamsReducer from '../granuleDownloadParams'
import {
  UPDATE_GRANULE_DOWNLOAD_PARAMS
} from '../../constants/actionTypes'

const initialState = {}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(updateGranuleDownloadParamsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_GRANULE_DOWNLOAD_PARAMS', () => {
  test('returns the correct state when collection has not been visited yet', () => {
    const action = {
      type: UPDATE_GRANULE_DOWNLOAD_PARAMS,
      payload: {}
    }

    const expectedState = {}

    expect(updateGranuleDownloadParamsReducer(undefined, action)).toEqual(expectedState)
  })
})
