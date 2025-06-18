import {
  METRICS_ADD_COLLECTION_PROJECT,
  METRICS_ADD_GRANULE_PROJECT,
  METRICS_BROWSE_GRANULE_IMAGE,
  METRICS_CLICK,
  METRICS_DATA_ACCESS,
  METRICS_GRANULE_FILTER,
  METRICS_MAP,
  METRICS_RELATED_COLLECTION,
  METRICS_SPATIAL_EDIT,
  METRICS_SPATIAL_SELECTION,
  METRICS_TEMPORAL_FILTER,
  METRICS_TIMELINE,
  METRICS_COLLECTION_SORT_CHANGE
} from './constants'

export const metricsAddCollectionProject = (payload) => ({
  type: METRICS_ADD_COLLECTION_PROJECT,
  payload
})

export const metricsAddGranuleProject = (payload) => ({
  type: METRICS_ADD_GRANULE_PROJECT,
  payload
})

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

export const metricsBrowseGranuleImage = (payload) => ({
  type: METRICS_BROWSE_GRANULE_IMAGE,
  payload
})

export const metricsSpatialEdit = (payload) => ({
  type: METRICS_SPATIAL_EDIT,
  payload
})

export const metricsGranuleFilter = (payload) => ({
  type: METRICS_GRANULE_FILTER,
  payload
})

export const metricsTemporalFilter = (payload) => ({
  type: METRICS_TEMPORAL_FILTER,
  payload
})

export const metricsSpatialSelection = (payload) => ({
  type: METRICS_SPATIAL_SELECTION,
  payload
})

export const metricsCollectionSortChange = (payload) => ({
  type: METRICS_COLLECTION_SORT_CHANGE,
  payload
})

export const metricsRelatedCollection = (payload) => ({
  type: METRICS_RELATED_COLLECTION,
  payload
})
