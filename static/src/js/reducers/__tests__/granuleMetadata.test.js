import granuleMetadataReducer from '../granuleMetadata'
import {
  ADD_GRANULE_METADATA,
  UPDATE_GRANULE_METADATA
} from '../../constants/actionTypes'

const initialState = {}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(granuleMetadataReducer(undefined, action)).toEqual(initialState)
  })
})

describe('ADD_GRANULE_METADATA', () => {
  test('returns the correct state', () => {
    const action = {
      type: ADD_GRANULE_METADATA,
      payload: [{
        id: 'granuleId',
        mock: 'metadata'
      }]
    }

    const expectedState = {
      ...initialState,
      granuleId: {
        id: 'granuleId',
        mock: 'metadata'
      }
    }

    expect(granuleMetadataReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('UPDATE_GRANULE_METADATA', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_GRANULE_METADATA,
      payload: [{
        id: 'granuleId',
        graphQlData: 'graphql metadata'
      }]
    }

    const initial = {
      ...initialState,
      granuleId: {
        id: 'granuleId',
        mock: 'metadata'
      }
    }

    const expectedState = {
      ...initialState,
      granuleId: {
        id: 'granuleId',
        mock: 'metadata',
        graphQlData: 'graphql metadata'
      }
    }

    expect(granuleMetadataReducer(initial, action)).toEqual(expectedState)
  })
})
