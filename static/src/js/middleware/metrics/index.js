import { LOCATION_CHANGE } from 'connected-react-router'

import {
  collectionSortChange,
  addCollectionProject,
  addGranuleProject,
  browseGranuleImage,
  dataAccess,
  defaultClick,
  granuleFilter,
  map,
  relatedCollection,
  spatialEdit,
  spatialSelection,
  temporalFilter,
  timeline,
  timing,
  virtualPageview
} from './events'

import {
  METRICS_BROWSE_GRANULE_IMAGE,
  METRICS_CLICK,
  METRICS_COLLECTION_SORT_CHANGE,
  METRICS_DATA_ACCESS,
  METRICS_GRANULE_FILTER,
  METRICS_ADD_COLLECTION_PROJECT,
  METRICS_ADD_GRANULE_PROJECT,
  METRICS_MAP,
  METRICS_RELATED_COLLECTION,
  METRICS_SPATIAL_EDIT,
  METRICS_SPATIAL_SELECTION,
  METRICS_TEMPORAL_FILTER,
  METRICS_TIMELINE,
  METRICS_TIMING
} from './constants'

const createMetricsMiddleware = () => ({ getState }) => (next) => (action) => {
  if (action.type === LOCATION_CHANGE) {
    virtualPageview(action, getState())
  }

  if (action.type === METRICS_DATA_ACCESS) {
    dataAccess(action, getState())
  }

  if (action.type === METRICS_ADD_COLLECTION_PROJECT) {
    addCollectionProject(action)
  }

  if (action.type === METRICS_ADD_GRANULE_PROJECT) {
    addGranuleProject(action)
  }

  if (action.type === METRICS_CLICK) {
    defaultClick(action)
  }

  if (action.type === METRICS_TIMELINE) {
    timeline(action)
  }

  if (action.type === METRICS_MAP) {
    map(action)
  }

  if (action.type === METRICS_GRANULE_FILTER) {
    granuleFilter(action)
  }

  if (action.type === METRICS_TEMPORAL_FILTER) {
    temporalFilter(action)
  }

  if (action.type === METRICS_BROWSE_GRANULE_IMAGE) {
    browseGranuleImage(action)
  }

  if (action.type === METRICS_RELATED_COLLECTION) {
    relatedCollection(action)
  }

  if (action.type === METRICS_SPATIAL_EDIT) {
    spatialEdit(action)
  }

  if (action.type === METRICS_SPATIAL_SELECTION) {
    spatialSelection(action)
  }

  if (action.type === METRICS_TIMING) {
    timing(action)
  }

  if (action.type === METRICS_COLLECTION_SORT_CHANGE) {
    collectionSortChange(action)
  }

  return next(action)
}

export const metricsMiddleware = createMetricsMiddleware()
export default metricsMiddleware
