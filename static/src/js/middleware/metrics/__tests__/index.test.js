import { LOCATION_CHANGE } from 'connected-react-router'

import {
  METRICS_CLICK,
  METRICS_COLLECTION_SORT_CHANGE,
  METRICS_BROWSE_GRANULE_IMAGE,
  METRICS_DATA_ACCESS,
  METRICS_GRANULE_FILTER,
  METRICS_ADD_COLLECTION_PROJECT,
  METRICS_ADD_GRANULE_PROJECT,
  METRICS_MAP,
  METRICS_RELATED_COLLECTION,
  METRICS_SPATIAL_EDIT,
  METRICS_SPATIAL_SELECTION,
  METRICS_TEMPORAL_FILTER,
  METRICS_TIMELINE
} from '../constants'
import * as events from '../events'
import metricsMiddleware from '../index'

jest.mock('../events', () => ({
  browseGranuleImage: jest.fn(),
  collectionSortChange: jest.fn(),
  dataAccess: jest.fn(),
  defaultClick: jest.fn(),
  granuleFilter: jest.fn(),
  addCollectionProject: jest.fn(),
  addGranuleProject: jest.fn(),
  map: jest.fn(),
  relatedCollection: jest.fn(),
  spatialEdit: jest.fn(),
  spatialSelection: jest.fn(),
  temporalFilter: jest.fn(),
  timeline: jest.fn(),
  timing: jest.fn(),
  virtualPageview: jest.fn()
}))

const createStore = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn()
  }

  const next = jest.fn()

  const invoke = (action) => metricsMiddleware(store)(next)(action)

  return {
    store,
    next,
    invoke
  }
}

describe('metrics middleware', () => {
  test('passes through non-function action', () => {
    const { next, invoke } = createStore()
    const action = { type: 'TEST' }
    invoke(action)
    expect(next).toHaveBeenCalledWith(action)
  })

  test('calls virtualPageview on react-router location change', () => {
    const { store, invoke } = createStore()

    const action = {
      type: LOCATION_CHANGE
    }
    invoke(action)
    expect(events.virtualPageview).toHaveBeenCalledTimes(1)
    expect(events.virtualPageview).toHaveBeenCalledWith(action, store.getState())
  })

  test('calls dataAccess event', () => {
    const { store, invoke } = createStore()

    const action = {
      type: METRICS_DATA_ACCESS,
      payload: {
        type: 'Test',
        collections: []
      }
    }
    invoke(action)
    expect(events.dataAccess).toHaveBeenCalledTimes(1)
    expect(events.dataAccess).toHaveBeenCalledWith(action, store.getState())
  })

  test('calls defaultClick event', () => {
    const { invoke } = createStore()

    const action = {
      type: METRICS_CLICK,
      payload: {
        type: 'Test'
      }
    }
    invoke(action)
    expect(events.defaultClick).toHaveBeenCalledTimes(1)
    expect(events.defaultClick).toHaveBeenCalledWith(action)
  })

  test('calls browseGranuleImage event', () => {
    const { invoke } = createStore()

    const action = {
      type: METRICS_BROWSE_GRANULE_IMAGE,
      payload: {
        value: 'Test Value',
        granuleId: 'TEST_ID'
      }
    }
    invoke(action)
    expect(events.browseGranuleImage).toHaveBeenCalledTimes(1)
    expect(events.browseGranuleImage).toHaveBeenCalledWith(action)
  })

  test('calls timeline event', () => {
    const { invoke } = createStore()

    const action = {
      type: METRICS_TIMELINE,
      payload: {
        type: 'Test'
      }
    }
    invoke(action)
    expect(events.timeline).toHaveBeenCalledTimes(1)
    expect(events.timeline).toHaveBeenCalledWith(action)
  })

  test('calls map event', () => {
    const { invoke } = createStore()

    const action = {
      type: METRICS_MAP,
      payload: {
        type: 'Test'
      }
    }
    invoke(action)
    expect(events.map).toHaveBeenCalledTimes(1)
    expect(events.map).toHaveBeenCalledWith(action)
  })

  test('calls spatialEdit event', () => {
    const { invoke } = createStore()

    const action = {
      type: METRICS_SPATIAL_EDIT,
      payload: {
        type: 'Test'
      }
    }
    invoke(action)
    expect(events.spatialEdit).toHaveBeenCalledTimes(1)
    expect(events.spatialEdit).toHaveBeenCalledWith(action)
  })

  test('calls spatialSelection event', () => {
    const { invoke } = createStore()

    const action = {
      type: METRICS_SPATIAL_SELECTION,
      payload: {
        item: 'Test'
      }
    }
    invoke(action)
    expect(events.spatialSelection).toHaveBeenCalledTimes(1)
    expect(events.spatialSelection).toHaveBeenCalledWith(action)
  })

  test('calls granuleFilter event', () => {
    const { invoke } = createStore()

    const action = {
      type: METRICS_GRANULE_FILTER,
      payload: {
        item: 'Test'
      }
    }
    invoke(action)
    expect(events.granuleFilter).toHaveBeenCalledTimes(1)
    expect(events.granuleFilter).toHaveBeenCalledWith(action)
  })

  test('calls addCollectionProject event', () => {
    const { invoke } = createStore()

    const action = {
      type: METRICS_ADD_COLLECTION_PROJECT,
      payload: {
        item: 'Test'
      }
    }
    invoke(action)
    expect(events.addCollectionProject).toHaveBeenCalledTimes(1)
    expect(events.addCollectionProject).toHaveBeenCalledWith(action)
  })

  test('calls addGranuleProject event', () => {
    const { invoke } = createStore()

    const action = {
      type: METRICS_ADD_GRANULE_PROJECT,
      payload: {
        item: 'Test'
      }
    }
    invoke(action)
    expect(events.addGranuleProject).toHaveBeenCalledTimes(1)
    expect(events.addGranuleProject).toHaveBeenCalledWith(action)
  })

  test('calls temporalFilter event', () => {
    const { invoke } = createStore()

    const action = {
      type: METRICS_TEMPORAL_FILTER,
      payload: {
        item: 'Test'
      }
    }
    invoke(action)
    expect(events.temporalFilter).toHaveBeenCalledTimes(1)
    expect(events.temporalFilter).toHaveBeenCalledWith(action)
  })

  test('calls collectionSortChange event', () => {
    const { invoke } = createStore()

    const action = {
      type: METRICS_COLLECTION_SORT_CHANGE,
      payload: {
        type: 'Test'
      }
    }
    invoke(action)
    expect(events.collectionSortChange).toHaveBeenCalledTimes(1)
    expect(events.collectionSortChange).toHaveBeenCalledWith(action)
  })

  test('calls relatedCollection event', () => {
    const { invoke } = createStore()

    const action = {
      type: METRICS_RELATED_COLLECTION,
      payload: {
        type: 'view',
        collectionId: 'TEST_ID'
      }
    }
    invoke(action)
    expect(events.relatedCollection).toHaveBeenCalledTimes(1)
    expect(events.relatedCollection).toHaveBeenCalledWith(action)
  })
})
