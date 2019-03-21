import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { changeMap, updateMap } from '../map'
import { UPDATE_MAP } from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

describe('updateMap', () => {
  test('should create an action to update the search query', () => {
    const payload = {
      mapParam: '0!0!2!1!0!0,2'
    }
    const expectedAction = {
      type: UPDATE_MAP,
      payload
    }
    expect(updateMap(payload)).toEqual(expectedAction)
  })
})

describe('changeMap', () => {
  test('should create an action to update the query', () => {
    const newMap = {
      mapParam: '0!0!2!1!0!0,2'
    }

    // mockStore with initialState
    const store = mockStore({
      map: {}
    })

    // call the dispatch
    store.dispatch(changeMap({ ...newMap }))

    // Is updateSearchQuery called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_MAP,
      payload: { ...newMap }
    })
  })
})
