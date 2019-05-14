import granuleMetadataReducer from '../granuleMetadata'
import {
  UPDATE_GRANULE_METADATA
} from '../../constants/actionTypes'

const initialState = {
  allIds: [],
  byId: {}
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(granuleMetadataReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_GRANULE_METADATA', () => {
  test('returns the correct state when collection has not been visited yet', () => {
    const action = {
      type: UPDATE_GRANULE_METADATA,
      payload: {
        granuleId: '<MockGranule>Data</MockGranule>'
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['granuleId'],
      byId: {
        granuleId: '<MockGranule>Data</MockGranule>'
      }
    }

    expect(granuleMetadataReducer(undefined, action)).toEqual(expectedState)
  })
})
