import {
  METRICS_CLICK,
  METRICS_DATA_ACCESS,
  METRICS_MAP,
  METRICS_RELATED_COLLECTION,
  METRICS_SPATIAL_EDIT,
  METRICS_TIMELINE,
  METRICS_TIMING,
  METRICS_COLLECTION_SORT_CHANGE
} from './constants'

export const metricsDataAccess = (payload) => ({
  type: METRICS_DATA_ACCESS,
  payload
})

export const metricsClick = (payload) => ({
  type: METRICS_CLICK,
  payload
})

export const metricsTimeline = (type) => ({
  type: METRICS_TIMELINE,
  payload: {
    eventLabel: type
  }
})

export const metricsMap = (type) => ({
  type: METRICS_MAP,
  payload: {
    eventLabel: type
  }
})

export const metricsSpatialEdit = (payload) => ({
  type: METRICS_SPATIAL_EDIT,
  payload
})

export const metricsTiming = (payload) => ({
  type: METRICS_TIMING,
  payload
})

export const metricsCollectionSortChange = (payload) => ({
  type: METRICS_COLLECTION_SORT_CHANGE,
  payload
})

export const metricsRelatedCollection = payload => ({
  type: METRICS_RELATED_COLLECTION,
  payload
})
