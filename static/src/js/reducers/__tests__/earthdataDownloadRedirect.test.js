import earthdataDownloadRedirectReducer from '../earthdataDownloadRedirect'
import { ADD_EARTHDATA_DOWNLOAD_REDIRECT } from '../../constants/actionTypes'

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }
    const initialState = {}

    expect(earthdataDownloadRedirectReducer(undefined, action)).toEqual(initialState)
  })
})

describe('ADD_EARTHDATA_DOWNLOAD_REDIRECT', () => {
  test('returns the correct state', () => {
    const payload = { redirect: 'earthdata-download://authCallback' }
    const action = {
      type: ADD_EARTHDATA_DOWNLOAD_REDIRECT,
      payload
    }

    const expectedState = payload

    expect(earthdataDownloadRedirectReducer(undefined, action)).toEqual(expectedState)
  })
})
