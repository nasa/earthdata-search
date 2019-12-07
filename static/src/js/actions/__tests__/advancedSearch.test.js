import { UPDATE_ADVANCED_SEARCH } from '../../constants/actionTypes'
import { updateAdvancedSearch } from '../advancedSearch'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateAdvancedSearch', () => {
  test('should create an action to update the advancedSearch state', () => {
    const payload = 'authToken-token'
    const expectedAction = {
      type: UPDATE_ADVANCED_SEARCH,
      payload
    }
    expect(updateAdvancedSearch(payload)).toEqual(expectedAction)
  })
})
