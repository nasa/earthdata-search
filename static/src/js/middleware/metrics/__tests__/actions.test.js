import {
  METRICS_CLICK,
  METRICS_DATA_ACCESS,
  METRICS_MAP,
  METRICS_RELATED_COLLECTION,
  METRICS_SPATIAL_EDIT,
  METRICS_TIMELINE,
  METRICS_TIMING,
  METRICS_COLLECTION_SORT_CHANGE
} from '../constants'

import {
  metricsDataAccess,
  metricsClick,
  metricsTimeline,
  metricsMap,
  metricsRelatedCollection,
  metricsSpatialEdit,
  metricsTiming,
  metricsCollectionSortChange
} from '../actions'

describe('actions', () => {
  describe('metricsDataAccess', () => {
    test('returns the correct action', () => {
      const data = {
        test: 'test payload'
      }

      const action = metricsDataAccess(data)

      const {
        type,
        payload
      } = action

      expect(type).toEqual(METRICS_DATA_ACCESS)
      expect(payload).toEqual(data)
    })
  })

  describe('metricsClick', () => {
    test('returns the correct action', () => {
      const data = {
        test: 'test payload'
      }

      const action = metricsClick(data)

      const {
        type,
        payload
      } = action

      expect(type).toEqual(METRICS_CLICK)
      expect(payload).toEqual(data)
    })
  })

  describe('metricsTimeline', () => {
    test('returns the correct action', () => {
      const data = 'test data'

      const action = metricsTimeline(data)

      const {
        type,
        payload
      } = action

      expect(type).toEqual(METRICS_TIMELINE)
      expect(payload.eventLabel).toEqual(data)
    })
  })

  describe('metricsMap', () => {
    test('returns the correct action', () => {
      const data = 'test data'

      const action = metricsMap(data)

      const {
        type,
        payload
      } = action

      expect(type).toEqual(METRICS_MAP)
      expect(payload.eventLabel).toEqual(data)
    })
  })

  describe('metricsSpatialEdit', () => {
    test('returns the correct action', () => {
      const data = {
        test: 'test payload'
      }

      const action = metricsSpatialEdit(data)

      const {
        type,
        payload
      } = action

      expect(type).toEqual(METRICS_SPATIAL_EDIT)
      expect(payload).toEqual(data)
    })
  })

  describe('metricsTiming', () => {
    test('returns the correct action', () => {
      const data = {
        test: 'test payload'
      }

      const action = metricsTiming(data)

      const {
        type,
        payload
      } = action

      expect(type).toEqual(METRICS_TIMING)
      expect(payload).toEqual(data)
    })
  })

  describe('metricsCollectionSortChange', () => {
    test('returns the correct action', () => {
      const data = {
        test: 'test payload'
      }

      const action = metricsCollectionSortChange(data)

      const {
        type,
        payload
      } = action

      expect(type).toEqual(METRICS_COLLECTION_SORT_CHANGE)
      expect(payload).toEqual(data)
    })
  })

  describe('metricsRelatedCollection', () => {
    test('returns the correct action', () => {
      const data = {
        test: 'test payload'
      }

      const action = metricsRelatedCollection(data)

      const {
        type,
        payload
      } = action

      expect(type).toEqual(METRICS_RELATED_COLLECTION)
      expect(payload).toEqual(data)
    })
  })
})
