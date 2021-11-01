import { LOCATION_CHANGE } from 'connected-react-router'

import * as helpers from '../helpers'
import {
  virtualPageview,
  dataAccess,
  defaultClick,
  timeline,
  map,
  relatedCollection,
  spatialEdit,
  timing,
  collectionSortChange
} from '../events'
import {
  METRICS_DATA_ACCESS,
  METRICS_CLICK,
  METRICS_COLLECTION_SORT_CHANGE,
  METRICS_TIMELINE,
  METRICS_MAP,
  METRICS_RELATED_COLLECTION,
  METRICS_SPATIAL_EDIT,
  METRICS_TIMING
} from '../constants'

const dataLayerMock = global.dataLayer.push

describe('events', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('virtualPageview', () => {
    describe('on a PUSH event', () => {
      test('pushes to the dataLayer', () => {
        helpers.computeKeyword = jest.fn(() => 'Keyword')
        helpers.computeSpatialType = jest.fn(() => 'Spatial Type')
        helpers.computeTemporalType = jest.fn(() => 'Temporal Type')
        helpers.computeCollectionsViewed = jest.fn(() => 'Collections Viewed')
        helpers.computeCollectionsAdded = jest.fn(() => 'Collections Added')
        helpers.computeFacets = jest.fn(() => 'Facets')

        const action = {
          type: LOCATION_CHANGE,
          payload: {
            action: 'PUSH'
          }
        }

        const state = {
          test: 'test'
        }

        virtualPageview(action, state)

        expect(dataLayerMock).toHaveBeenCalledTimes(1)
        expect(dataLayerMock).toHaveBeenCalledWith({
          dimension11: 'Keyword',
          dimension12: 'Spatial Type',
          dimension13: 'Temporal Type',
          dimension14: 'Collections Viewed',
          dimension15: 'Collections Added',
          dimension16: 'Facets',
          event: 'virtualPageView'
        })
      })
    })

    describe('on a non-PUSH event', () => {
      test('does not push to the dataLayer', () => {
        helpers.computeKeyword = jest.fn(() => 'Keyword')
        helpers.computeSpatialType = jest.fn(() => 'Spatial Type')
        helpers.computeTemporalType = jest.fn(() => 'Temporal Type')
        helpers.computeCollectionsViewed = jest.fn(() => 'Collections Viewed')
        helpers.computeCollectionsAdded = jest.fn(() => 'Collections Added')
        helpers.computeFacets = jest.fn(() => 'Facets')

        const action = {
          type: LOCATION_CHANGE,
          payload: {
            action: 'POP'
          }
        }

        const state = {
          test: 'test'
        }

        virtualPageview(action, state)

        expect(dataLayerMock).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('dataAccess', () => {
    describe('data access init', () => {
      test('pushes to the dataLayer', () => {
        const action = {
          type: METRICS_DATA_ACCESS,
          payload: {
            type: 'data_access_init',
            collections: [{
              collectionId: 'TEST_COL_ID'
            }]
          }
        }

        dataAccess(action)

        expect(dataLayerMock).toHaveBeenCalledTimes(2)
        expect(dataLayerMock).toHaveBeenNthCalledWith(1, {
          event: 'dataAccess',
          dimension17: 'TEST_COL_ID',
          dimension18: null,
          dimension19: null,
          dataAccessCategory: 'Data Access',
          dataAccessAction: 'Initiation',
          dataAccessLabel: 'Data Access Initiation',
          dataAccessValue: 1
        })

        expect(dataLayerMock).toHaveBeenNthCalledWith(2, {
          dimension17: null,
          dimension18: null,
          dimension19: null,
          dataAccessCategory: null,
          dataAccessAction: null,
          dataAccessLabel: null,
          dataAccessValue: null
        })
      })
    })

    describe('data access completion', () => {
      describe('single collections', () => {
        test('pushes to the dataLayer', () => {
          const action = {
            type: METRICS_DATA_ACCESS,
            payload: {
              type: 'data_access_completion',
              collections: [{
                collectionId: 'TEST_COL_ID',
                type: 'Test Type',
                service: 'Test Service'
              }]
            }
          }

          dataAccess(action)

          expect(dataLayerMock).toHaveBeenCalledTimes(2)
          expect(dataLayerMock).toHaveBeenNthCalledWith(1, {
            event: 'dataAccess',
            dimension17: 'TEST_COL_ID',
            dimension18: 'Test Service',
            dimension19: 'Test Type',
            dataAccessCategory: 'Data Access',
            dataAccessAction: 'Completion',
            dataAccessLabel: 'Data Access Completion',
            dataAccessValue: 1
          })

          expect(dataLayerMock).toHaveBeenNthCalledWith(2, {
            dimension17: null,
            dimension18: null,
            dimension19: null,
            dataAccessCategory: null,
            dataAccessAction: null,
            dataAccessLabel: null,
            dataAccessValue: null
          })
        })
      })

      describe('multiple collections', () => {
        test('pushes to the dataLayer', () => {
          const action = {
            type: METRICS_DATA_ACCESS,
            payload: {
              type: 'data_access_completion',
              collections: [{
                collectionId: 'TEST_COL_ID_1',
                type: 'Test Type 1',
                service: 'Test Service 1'
              },
              {
                collectionId: 'TEST_COL_ID_2',
                type: 'Test Type 2',
                service: 'Test Service 2'
              }]
            }
          }

          dataAccess(action)

          expect(dataLayerMock).toHaveBeenCalledTimes(3)
          expect(dataLayerMock).toHaveBeenNthCalledWith(1, {
            event: 'dataAccess',
            dimension17: 'TEST_COL_ID_1',
            dimension18: 'Test Service 1',
            dimension19: 'Test Type 1',
            dataAccessCategory: 'Data Access',
            dataAccessAction: 'Completion',
            dataAccessLabel: 'Data Access Completion',
            dataAccessValue: 1
          })

          expect(dataLayerMock).toHaveBeenNthCalledWith(2, {
            event: 'dataAccess',
            dimension17: 'TEST_COL_ID_2',
            dimension18: 'Test Service 2',
            dimension19: 'Test Type 2',
            dataAccessCategory: 'Data Access',
            dataAccessAction: 'Completion',
            dataAccessLabel: 'Data Access Completion',
            dataAccessValue: 1
          })

          expect(dataLayerMock).toHaveBeenNthCalledWith(3, {
            dimension17: null,
            dimension18: null,
            dimension19: null,
            dataAccessCategory: null,
            dataAccessAction: null,
            dataAccessLabel: null,
            dataAccessValue: null
          })
        })
      })
    })

    describe('single granule download', () => {
      test('pushes to the dataLayer', () => {
        const action = {
          type: METRICS_DATA_ACCESS,
          payload: {
            type: 'single_granule_download',
            collections: [{
              collectionId: 'TEST_COL_ID'
            }]
          }
        }

        dataAccess(action)

        expect(dataLayerMock).toHaveBeenCalledTimes(2)
        expect(dataLayerMock).toHaveBeenNthCalledWith(1, {
          event: 'dataAccess',
          dimension17: 'TEST_COL_ID',
          dimension18: 'Single Granule',
          dimension19: 'single_granule',
          dataAccessCategory: 'Data Access',
          dataAccessAction: 'Completion',
          dataAccessLabel: 'Data Access Completion',
          dataAccessValue: 1
        })

        expect(dataLayerMock).toHaveBeenNthCalledWith(2, {
          dimension17: null,
          dimension18: null,
          dimension19: null,
          dataAccessCategory: null,
          dataAccessAction: null,
          dataAccessLabel: null,
          dataAccessValue: null
        })
      })
    })
  })

  describe('defaultClick', () => {
    test('pushes to the dataLayer', () => {
      const action = {
        type: METRICS_CLICK,
        payload: {
          elementLabel: 'Some element label'
        }
      }

      defaultClick(action)

      expect(dataLayerMock).toHaveBeenCalledTimes(1)
      expect(dataLayerMock).toHaveBeenCalledWith({
        event: 'defaultClick',
        defaultClickCategory: 'button',
        defaultClickAction: 'click',
        defaultClickLabel: 'Some element label'
      })
    })
  })

  describe('map', () => {
    test('pushes to the dataLayer', () => {
      const action = {
        type: METRICS_TIMELINE,
        payload: {
          eventLabel: 'Some timeline event'
        }
      }

      timeline(action)

      expect(dataLayerMock).toHaveBeenCalledTimes(1)
      expect(dataLayerMock).toHaveBeenCalledWith({
        event: 'timeline',
        timelineEventCategory: 'button',
        timelineEventAction: 'click',
        timelineEventLabel: 'Timeline Some timeline event'
      })
    })
  })

  describe('map', () => {
    test('pushes to the dataLayer', () => {
      const action = {
        type: METRICS_MAP,
        payload: {
          eventLabel: 'Some map event'
        }
      }

      map(action)

      expect(dataLayerMock).toHaveBeenCalledTimes(1)
      expect(dataLayerMock).toHaveBeenCalledWith({
        event: 'map',
        mapEventCategory: 'button',
        mapEventAction: 'click',
        mapEventLabel: 'Map Some map event'
      })
    })
  })

  describe('spatialEdit', () => {
    test('pushes to the dataLayer', () => {
      const action = {
        type: METRICS_SPATIAL_EDIT,
        payload: {
          type: 'Some Type',
          distanceSum: 12.22
        }
      }

      spatialEdit(action)

      expect(dataLayerMock).toHaveBeenCalledTimes(1)
      expect(dataLayerMock).toHaveBeenCalledWith({
        event: 'spatialEdit',
        spatialEditEventCategory: 'Spatial Edit',
        spatialEditEventAction: 'Some Type',
        spatialEditEventLabel: '',
        spatialEditEventValue: 12
      })
    })
  })

  describe('timing', () => {
    test('pushes to the dataLayer', () => {
      const action = {
        type: METRICS_TIMING,
        payload: {
          url: 'http://google.com/some/test/url',
          timing: 1222
        }
      }

      timing(action)

      expect(dataLayerMock).toHaveBeenCalledTimes(1)
      expect(dataLayerMock).toHaveBeenCalledWith({
        event: 'timing',
        timingEventCategory: 'ajax',
        timingEventVar: 'http://google.com/some/test/url',
        timingEventValue: 1222
      })
    })
  })

  describe('collectionsSortChange', () => {
    test('pushes to the dataLayer', () => {
      const action = {
        type: METRICS_COLLECTION_SORT_CHANGE,
        payload: {
          value: '-test_value'
        }
      }

      collectionSortChange(action)

      expect(dataLayerMock).toHaveBeenCalledTimes(1)
      expect(dataLayerMock).toHaveBeenCalledWith({
        event: 'collectionSortChange',
        collectionSortChangeCategory: 'search result sort',
        collectionSortChangeAction: 'change',
        collectionSortChangeLabel: '-test_value'
      })
    })
  })

  describe('relatedCollection', () => {
    test('pushes to the dataLayer', () => {
      const action = {
        type: METRICS_RELATED_COLLECTION,
        payload: {
          type: 'view',
          collectionId: 'TEST_ID'
        }
      }

      relatedCollection(action)

      expect(dataLayerMock).toHaveBeenCalledTimes(1)
      expect(dataLayerMock).toHaveBeenCalledWith({
        event: 'relatedCollection',
        relatedCollectionCategory: 'related collection',
        relatedCollectionAction: 'view',
        relatedCollectionLabel: 'TEST_ID'
      })
    })
  })
})
