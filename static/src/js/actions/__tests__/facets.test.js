import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'

import {
  changeCmrFacet,
  changeFeatureFacet,
  updateCmrFacet,
  updateFeatureFacet
} from '../facets'

import {
  UPDATE_SELECTED_FEATURE_FACET,
  UPDATE_SELECTED_CMR_FACET
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateCmrFacet', () => {
  test('should create an action to update the CMR Facets query', () => {
    const payload = {
      data_center_h: ['facet1']
    }
    const expectedAction = {
      type: UPDATE_SELECTED_CMR_FACET,
      payload
    }
    expect(updateCmrFacet(payload)).toEqual(expectedAction)
  })
})

describe('updateFeatureFacet', () => {
  test('should create an action to update the CMR Facets query', () => {
    const payload = {
      mapImagery: true
    }
    const expectedAction = {
      type: UPDATE_SELECTED_FEATURE_FACET,
      payload
    }
    expect(updateFeatureFacet(payload)).toEqual(expectedAction)
  })
})

describe('changeCmrFacet', () => {
  test('should update the CMR Facets and call getCollections', () => {
    const newFacets = {
      data_center_h: ['facet1']
    }

    // mock getCollections
    const getCollectionsMock = jest.spyOn(actions, 'getCollections')
    getCollectionsMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({})

    // call the dispatch
    store.dispatch(changeCmrFacet({ ...newFacets }))

    // Is updateCmrFacet called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_SELECTED_CMR_FACET,
      payload: newFacets
    })

    // was getCollections called
    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
  })
})

describe('changeFeatureFacet', () => {
  test('should update the Feature Facets and call getCollections', () => {
    const newFacets = {
      mapImagery: true
    }

    // mock getCollections
    const getCollectionsMock = jest.spyOn(actions, 'getCollections')
    getCollectionsMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({})

    // call the dispatch
    store.dispatch(changeFeatureFacet({ ...newFacets }))

    // Is updateFeatureFacet called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_SELECTED_FEATURE_FACET,
      payload: newFacets
    })

    // was getCollections called
    expect(getCollectionsMock).toHaveBeenCalledTimes(1)
  })
})
