import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'
import { updateSearchQuery } from '../search'
import { UPDATE_SEARCH_QUERY } from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateSearchQuery', () => {
  test('should create an action to update the search query', () => {
    const payload = {
      keyword: 'new keyword',
      spatial: {
        point: '0,0'
      }
    }
    const expectedAction = {
      type: UPDATE_SEARCH_QUERY,
      payload
    }
    expect(updateSearchQuery(payload)).toEqual(expectedAction)
  })
})

describe('changeQuery', () => {
  test('should update the search query and call getCollections', () => {
    const newQuery = {
      keyword: 'new keyword',
      spatial: {
        point: '0,0'
      },
      temporal: {}
    }

    // mock getCollections
    const getCollectionsMock = jest.spyOn(actions, 'getCollections')
    getCollectionsMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      query: {
        keyword: 'old stuff'
      }
    })

    // call the dispatch
    store.dispatch(actions.changeQuery({ ...newQuery }))

    // Is updateSearchQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_SEARCH_QUERY,
      payload: {
        keyword: 'new keyword',
        spatial: {
          point: '0,0'
        },
        temporal: {}
      }
    })

    // was getCollections called
    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
  })
})

describe('clearFilters', () => {
  test('clears the query and calls getCollections', () => {
    const query = {
      keyword: 'keyword search',
      spatial: {
        point: '0,0'
      }
    }
    const emptyQuery = {
      keyword: '',
      spatial: {},
      temporal: {}
    }

    // mockStore with initialState
    const store = mockStore(query)

    // mock getCollections
    const getCollectionsMock = jest.spyOn(actions, 'getCollections')
    getCollectionsMock.mockImplementation(() => jest.fn())

    // call the dispatch
    store.dispatch(actions.clearFilters())

    // Is changeUrl called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: '@@router/CALL_HISTORY_METHOD',
      payload: {
        args: [{}],
        method: 'push'
      }
    })

    // Is updateSearchQuery called with the right payload
    expect(storeActions[1]).toEqual({
      type: UPDATE_SEARCH_QUERY,
      payload: emptyQuery
    })

    // was getCollections called
    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
  })
})
