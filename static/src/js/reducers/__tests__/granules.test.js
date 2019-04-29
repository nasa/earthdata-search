import granulesReducer from '../granules'
import { UPDATE_GRANULES } from '../../constants/actionTypes'

const initialState = {
  allIds: [],
  byId: {},
  hits: null,
  isCwic: null,
  isLoaded: false,
  isLoading: false,
  loadTime: 0,
  timerStart: null
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
        hits: null,
        keyword: 'search keyword',
        isCwic: true
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
      },
      isCwic: true
    }

    expect(granulesReducer(undefined, action)).toEqual(expectedState)
  })
})
