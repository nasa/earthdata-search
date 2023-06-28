import { ADD_EARTHDATA_DOWNLOAD_REDIRECT } from '../../constants/actionTypes'
import { addEarthdataDownloadRedirect } from '../earthdataDownloadRedirect'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('addEarthdataDownloadRedirect', () => {
  test('should create an action to update the advancedSearch state', () => {
    const payload = { redirect: 'earthdata-download://authCallback' }

    const expectedAction = {
      type: ADD_EARTHDATA_DOWNLOAD_REDIRECT,
      payload
    }

    expect(addEarthdataDownloadRedirect(payload)).toEqual(expectedAction)
  })
})
