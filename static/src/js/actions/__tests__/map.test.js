import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { changeMap, updateMap } from '../map'
import { UPDATE_MAP } from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

describe('updateMap', () => {
  test('should create an action to update the search query', () => {
    const payload = {
      map: {
        latitude: 0,
        longitude: 0,
        zoom: 2
      }
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
      map: {
        latitude: 0,
        longitude: 0,
        zoom: 2
      }
    }

    // mockStore with initialState
    const store = mockStore({
      map: {}
    })

    // call the dispatch
    store.dispatch(changeMap({ ...newMap }))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_MAP,
      payload: { ...newMap }
    })
  })
})
