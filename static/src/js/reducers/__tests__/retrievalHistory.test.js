import retrievalHistoryReducer from '../retrievalHistory'
import {
  SET_RETRIEVAL_HISTORY,
  REMOVE_RETRIEVAL_HISTORY
} from '../../constants/actionTypes'

const initialState = []

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(retrievalHistoryReducer(undefined, action)).toEqual(initialState)
  })
})

describe('SET_RETRIEVAL_HISTORY', () => {
  test('returns the correct state when no data has been provided', () => {
    const action = {
      type: SET_RETRIEVAL_HISTORY,
      payload: [{
        id: 1,
        created_at: '2019-09-03T13:44:23.100Z',
        jsondata: {},
        collections: [{
          id: 'collection1'
        }]
      }, {
        id: 2,
        created_at: '2019-10-05T13:44:23.100Z',
        jsondata: {},
        collections: [{
          id: 'collection2'
        }]
      }]
    }

    const expectedState = [{
      id: 1,
      created_at: '2019-09-03T13:44:23.100Z',
      jsondata: {},
      collections: [{
        id: 'collection1'
      }]
    }, {
      id: 2,
      created_at: '2019-10-05T13:44:23.100Z',
      jsondata: {},
      collections: [{
        id: 'collection2'
      }]
    }]

    expect(retrievalHistoryReducer(undefined, action)).toEqual(expectedState)
  })

  test('returns the correct state when data has been provided', () => {
    const action = {
      type: SET_RETRIEVAL_HISTORY,
      payload: [{
        id: 2,
        created_at: '2019-10-05T13:44:23.100Z',
        jsondata: {},
        collections: [{
          id: 'collection2'
        }]
      }]
    }

    const initial = [{
      id: 1,
      created_at: '2019-09-03T13:44:23.100Z',
      jsondata: {},
      collections: [{
        id: 'collection1'
      }]
    }]

    const expectedState = [{
      id: 2,
      created_at: '2019-10-05T13:44:23.100Z',
      jsondata: {},
      collections: [{
        id: 'collection2'
      }]
    }]

    expect(retrievalHistoryReducer(initial, action)).toEqual(expectedState)
  })
})

describe('REMOVE_RETRIEVAL_HISTORY', () => {
  test('returns the correct state when data has been provided', () => {
    const action = {
      type: REMOVE_RETRIEVAL_HISTORY,
      payload: 2
    }

    const initial = [{
      id: 1,
      created_at: '2019-09-03T13:44:23.100Z',
      jsondata: {},
      collections: [{
        id: 'collection1'
      }]
    }, {
      id: 2,
      created_at: '2019-09-03T13:44:23.100Z',
      jsondata: {},
      collections: [{
        id: 'collection2'
      }]
    }, {
      id: 3,
      created_at: '2019-09-03T13:44:23.100Z',
      jsondata: {},
      collections: [{
        id: 'collection3'
      }]
    }]

    const expectedState = [{
      id: 1,
      created_at: '2019-09-03T13:44:23.100Z',
      jsondata: {},
      collections: [{
        id: 'collection1'
      }]
    }, {
      id: 3,
      created_at: '2019-09-03T13:44:23.100Z',
      jsondata: {},
      collections: [{
        id: 'collection3'
      }]
    }]

    expect(retrievalHistoryReducer(initial, action)).toEqual(expectedState)
  })
})
