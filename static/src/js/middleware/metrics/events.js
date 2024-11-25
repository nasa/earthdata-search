import {
  computeKeyword,
  computeSpatialType,
  computeTemporalType,
  computeCollectionsViewed,
  computeCollectionsAdded,
  computeFacets
} from './helpers'

const { dataLayer = [] } = window

/**
* Pushes a virtualPageView event on the dataLayer. Only fires on PUSH events.
* These `PUSH` events only fire during page transitions
* @param {Object} action - The action.
* @param {Object} state - The current state.
*/
export const virtualPageview = (action, state) => {
  const { payload } = action
  const { action: locationChangeType } = payload

  if (locationChangeType === 'PUSH') {
    dataLayer.push({
      event: 'virtualPageView',
      dimension11: computeKeyword(state), // Keyword Search
      dimension12: computeSpatialType(state), // Spatial
      dimension13: computeTemporalType(state), // Temporal
      dimension14: computeCollectionsViewed(state), // Collections Viewed
      dimension15: computeCollectionsAdded(state), // Collections Added
      dimension16: computeFacets(state) // Search Facet
    })
  }
}

/**
* Pushes a dataAccess event on the dataLayer.
* @param {Object} action - The action.
*
* type should be a string matching one of:
* - data_access_init
* - data_access_completion
* - single_granule_download
*
* collections should have shape:
* [{
*  collectionId,
*  method,
*  type
* }]

*/
export const dataAccess = (action) => {
  const { payload } = action
  const {
    type: accessType,
    collections = []
  } = payload

  if (collections && collections.length) {
    collections.forEach((m) => {
      const {
        collectionId,
        service,
        type
      } = m

      if (accessType === 'data_access_init') {
        dataLayer.push({
          event: 'dataAccess',
          dimension17: collectionId,
          dimension18: null,
          dimension19: null,
          dataAccessCategory: 'Data Access',
          dataAccessAction: 'Initiation',
          dataAccessLabel: 'Data Access Initiation',
          dataAccessValue: 1
        })
      }

      if (accessType === 'data_access_completion') {
        dataLayer.push({
          event: 'dataAccess',
          dimension17: collectionId,
          dimension18: service,
          dimension19: type,
          dataAccessCategory: 'Data Access',
          dataAccessAction: 'Completion',
          dataAccessLabel: 'Data Access Completion',
          dataAccessValue: 1
        })
      }

      if (accessType === 'single_granule_download') {
        dataLayer.push({
          event: 'dataAccess',
          dimension17: collectionId,
          dimension18: 'Single Granule',
          dimension19: 'single_granule',
          dataAccessCategory: 'Data Access',
          dataAccessAction: 'Completion',
          dataAccessLabel: 'Data Access Completion',
          dataAccessValue: 1
        })
      }

      if (accessType === 'single_granule_s3_access') {
        dataLayer.push({
          event: 'dataAccess',
          dimension17: collectionId,
          dimension18: 'S3 Single Granule',
          dimension19: 's3_single_granule',
          dataAccessCategory: 'Data Access',
          dataAccessAction: 'Completion',
          dataAccessLabel: 'Data Access Completion',
          dataAccessValue: 1
        })
      }
    })
  }

  dataLayer.push({
    dimension17: null,
    dimension18: null,
    dimension19: null,
    dataAccessCategory: null,
    dataAccessAction: null,
    dataAccessLabel: null,
    dataAccessValue: null
  })
}

/**
* Pushes a defaultClick event on the dataLayer.
* @param {Object} action - The action.
*/
export const defaultClick = (action) => {
  const { payload } = action
  const { elementLabel } = payload

  dataLayer.push({
    event: 'defaultClick',
    defaultClickCategory: 'button',
    defaultClickAction: 'click',
    defaultClickLabel: elementLabel
  })
}

/**
* Pushes a timeline event on the dataLayer.
* @param {Object} action - The action.
*/
export const timeline = (action) => {
  const { payload } = action
  const { eventLabel } = payload

  dataLayer.push({
    event: 'timeline',
    timelineEventCategory: 'button',
    timelineEventAction: 'click',
    timelineEventLabel: `Timeline ${eventLabel}`
  })
}

/**
* Pushes a map event on the dataLayer.
* @param {Object} action - The action.
*/
export const map = (action) => {
  const { payload } = action
  const { eventLabel } = payload

  dataLayer.push({
    event: 'map',
    mapEventCategory: 'button',
    mapEventAction: 'click',
    mapEventLabel: `Map ${eventLabel}`
  })
}

/**
* Pushes an add collection to project event on the dataLayer.
* This event is fired when a user adds a collection to their project
* @param {Object} action - The action.
*/
export const addCollectionProject = (action) => {
  const { payload } = action
  const {
    collectionConceptId,
    view,
    page
  } = payload
  dataLayer.push({
    event: 'addCollectionToProject',
    addProjectCollectionConceptId: collectionConceptId,
    addProjectCollectionResultsView: view,
    addProjectCollectionPage: page
  })
}

/**
* Pushes an add granule to project event on the dataLayer.
* This event is fired when a user adds a granule to their project
* @param {Object} action - The action.
*/
export const addGranuleProject = (action) => {
  const { payload } = action
  const {
    collectionConceptId,
    granuleConceptId,
    view,
    page
  } = payload
  dataLayer.push({
    event: 'addGranuleToProject',
    addProjectCollectionConceptId: collectionConceptId,
    addProjectGranuleConceptId: granuleConceptId,
    addProjectGranulePage: page,
    addProjectGranuleResultsView: view
  })
}

/**
* Pushes a spatialEdit event on the dataLayer.
* This event is fired when on the leaflet edit control we edit shapes on the map
* @param {Object} action - The action.
*/
export const spatialEdit = (action) => {
  const { payload } = action
  const {
    distanceSum,
    type
  } = payload

  dataLayer.push({
    event: 'spatialEdit',
    spatialEditEventCategory: 'Spatial Edit',
    spatialEditEventAction: type,
    spatialEditEventLabel: '',
    spatialEditEventValue: Math.round(distanceSum)
  })
}

/**
* Pushes a spatialSelection event on the dataLayer.
* @param {Object} action - The action.
*/
export const spatialSelection = (action) => {
  const { payload } = action
  const {
    item: shapeType
  } = payload

  dataLayer.push({
    event: 'spatialSelection',
    spatialSelectionCategory: 'Spatial Selection',
    spatialSelectionEventLabel: shapeType
  })
}

/**
* Pushes a granuleFilter event on the dataLayer.
* @param {Object} action - The action.
*/
export const granuleFilter = (action) => {
  const { payload } = action
  const {
    type,
    value
  } = payload
  dataLayer.push({
    event: 'granuleFilter',
    granuleFilterCategory: 'Granule Filter',
    granuleFilterEventAction: type,
    granuleFilterEventValue: value
  })
}

/**
* Pushes a browse-granule-image event on the dataLayer.
* @param {Object} action - The action.
*/
export const browseGranuleImage = (action) => {
  const { payload } = action
  const {
    modalOpen,
    granuleId,
    value
  } = payload

  dataLayer.push({
    event: 'browseGranuleImage',
    browseGranuleImageCategory: 'Browse Granule Image',
    browseGranuleImageModalOpen: modalOpen,
    browseGranuleImageGranuleId: granuleId,
    browseGranuleImageValue: value
  })
}

/**
* Pushes a timing event on the dataLayer.
* @param {Object} action - The action.
*/
export const timing = (action) => {
  const { payload } = action
  const {
    url,
    timing: timingValue
  } = payload

  dataLayer.push({
    event: 'timing',
    timingEventCategory: 'ajax',
    timingEventVar: url,
    timingEventValue: timingValue
  })
}

/**
* Pushes a collectionSortChange event on the dataLayer.
* @param {Object} action - The action.
*/
export const collectionSortChange = (action) => {
  const { payload } = action
  const { value } = payload

  dataLayer.push({
    event: 'collectionSortChange',
    collectionSortChangeCategory: 'search result sort',
    collectionSortChangeAction: 'change',
    collectionSortChangeLabel: value
  })
}

/**
* Pushes a relatedCollection event on the dataLayer.
* @param {Object} action - The action.
*/
export const relatedCollection = (action) => {
  const { payload } = action
  const { collectionId = '', type = '' } = payload

  dataLayer.push({
    event: 'relatedCollection',
    relatedCollectionCategory: 'related collection',
    relatedCollectionAction: type,
    relatedCollectionLabel: collectionId
  })
}
