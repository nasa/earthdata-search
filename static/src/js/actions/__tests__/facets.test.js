import {
  ERRORED_FACETS,
  LOADED_FACETS,
  LOADING_FACETS,
  UPDATE_FACETS
} from '../../constants/actionTypes'
import {
  onFacetsErrored,
  onFacetsLoaded,
  onFacetsLoading,
  updateFacets
} from '../facets'

describe('updateFacets', () => {
  test('should create an action to update the facets state', () => {
    const payload = 'mock-payload'
    const expectedAction = {
      type: UPDATE_FACETS,
      payload
    }

    expect(updateFacets(payload)).toEqual(expectedAction)
  })
})

describe('onFacetsLoading', () => {
  test('should create an action to update the facets state', () => {
    const expectedAction = {
      type: LOADING_FACETS
    }

    expect(onFacetsLoading()).toEqual(expectedAction)
  })
})

describe('onFacetsLoaded', () => {
  test('should create an action to update the facets state', () => {
    const payload = 'mock-payload'
    const expectedAction = {
      type: LOADED_FACETS,
      payload
    }

    expect(onFacetsLoaded(payload)).toEqual(expectedAction)
  })
})

describe('onFacetsErrored', () => {
  test('should create an action to update the facets state', () => {
    const expectedAction = {
      type: ERRORED_FACETS
    }

    expect(onFacetsErrored()).toEqual(expectedAction)
  })
})
