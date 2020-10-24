import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  getRegions,
  onRegionsErrored,
  onRegionsLoaded,
  onRegionsLoading,
  updateRegionResults
} from '../regions'

import {
  ERRORED_REGIONS,
  FINISHED_REGIONS_TIMER,
  LOADED_REGIONS,
  LOADING_REGIONS,
  STARTED_REGIONS_TIMER,
  UPDATE_REGION_RESULTS
} from '../../constants/actionTypes'

import actions from '..'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateRegionResults', () => {
  test('should create an action to update the search query', () => {
    const payload = []
    const expectedAction = {
      type: UPDATE_REGION_RESULTS,
      payload
    }
    expect(updateRegionResults(payload)).toEqual(expectedAction)
  })
})

describe('onRegionsLoading', () => {
  test('should create an action to update the search query', () => {
    const expectedAction = {
      type: LOADING_REGIONS
    }
    expect(onRegionsLoading()).toEqual(expectedAction)
  })
})

describe('onRegionsLoaded', () => {
  test('should create an action to update the search query', () => {
    const payload = { loaded: true }
    const expectedAction = {
      type: LOADED_REGIONS,
      payload
    }
    expect(onRegionsLoaded(payload)).toEqual(expectedAction)
  })
})

describe('onRegionsErrored', () => {
  test('should create an action to update the search query', () => {
    const expectedAction = {
      type: ERRORED_REGIONS
    }
    expect(onRegionsErrored()).toEqual(expectedAction)
  })
})

describe('getRegions', () => {
  test('calls lambda to get regions', async () => {
    nock(/localhost/)
      .get(/regions/)
      .reply(200, {
        hits: 1,
        time: 6.975,
        results: [{
          'California Region': {
            HUC: '18',
            'Bounding Box': '-124.53512390463686,32.13300128241485,-114.61976870231916,43.342727509806764',
            'Convex Hull Polygon': '-124.53512390463686,32.13300128241485,-114.61976870231916,43.342727509806764',
            'Visvalingam Polygon': '-121.63690052163548,43.34028642543558,-121.71937759754917,43.23098080164692,-121.93879272741691,43.27266344116555'
          }
        }]
      })

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      searchResults: {
        collections: {},
        facets: {},
        granules: {},
        regions: {},
        viewAllFacets: {}
      },
      query: {
        region: {
          endpoint: 'region',
          keyword: 'search keyword',
          exact: false
        }
      },
      cmr: {},
      facetsParams: {
        feature: {
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        }
      }
    })

    // call the dispatch
    await store.dispatch(getRegions()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_REGIONS })
      expect(storeActions[1]).toEqual({ type: STARTED_REGIONS_TIMER })
      expect(storeActions[2]).toEqual({ type: FINISHED_REGIONS_TIMER })
      expect(storeActions[3]).toEqual({
        type: LOADED_REGIONS,
        payload: { loaded: true }
      })
    })
  })

  test('does not call updateRegionResults on error', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')

    const errorPayload = {
      errors: ['Your query has returned 16575 results (> 100). If you\'re searching a specific HUC, use the parameter \'exact=True\'.Otherwise, refine your search to return less results, or head here: https://water.usgs.gov/GIS/huc.html to download mass HUC data.']
    }

    nock(/localhost/)
      .get(/regions/)
      .reply(413, errorPayload)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: '',
      searchResults: {
        collections: {},
        facets: {},
        granules: {},
        regions: {},
        viewAllFacets: {}
      },
      query: {
        region: {
          endpoint: 'huc',
          keyword: '10',
          exact: false
        }
      },
      cmr: {},
      facetsParams: {
        feature: {
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        }
      }
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(getRegions()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_REGIONS })
      expect(storeActions[1]).toEqual({ type: STARTED_REGIONS_TIMER })
      expect(storeActions[2]).toEqual({ type: FINISHED_REGIONS_TIMER })
      expect(storeActions[3]).toEqual({ type: ERRORED_REGIONS, payload: errorPayload.errors })
      expect(storeActions[4]).toEqual({
        type: LOADED_REGIONS,
        payload: { loaded: false }
      })

      expect(handleErrorMock).toHaveBeenCalledTimes(1)
      expect(handleErrorMock).toBeCalledWith(expect.objectContaining({
        action: 'getRegions',
        notificationType: 'none',
        resource: 'regions'
      }))

      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
