import granulesReducer from '../granules'
import { UPDATE_GRANULES } from '../../constants/actionTypes'

const initialState = {
  byId: {},
  allIds: []
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(granulesReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_GRANULES', () => {
  test('returns the correct state', () => {

    const action = {
      type: UPDATE_GRANULES,
      payload: {
        results: [{
          id: 'mockGranuleId',
          mockGranuleData: 'goes here'
        }],
        hits: 0,
        keyword: 'search keyword'
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['mockGranuleId'],
      byId: {
        mockGranuleId: {
          id: 'mockGranuleId',
          mockGranuleData: 'goes here'
        }
      }
    }

    expect(granulesReducer(undefined, action)).toEqual(expectedState)
  })
})
