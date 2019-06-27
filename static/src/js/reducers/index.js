import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import collectionMetadataReducer from './collectionMetadata'
import granuleMetadataReducer from './granuleMetadata'
import collectionsResultsReducer from './collectionsResults'
import authTokenReducer from './authToken'
import facetsReducer from './facets'
import {
  cmrFacetsReducer,
  featureFacetsReducer,
  viewAllFacetsReducer
} from './facetsParams'
import focusedCollectionReducer from './focusedCollection'
import granuleResultsReducer from './granuleResults'
import granuleDownloadReducer from './granuleDownload'
import mapReducer from './map'
import queryReducer from './query'
import timelineReducer from './timeline'
import uiReducer from './ui'
import viewAllFacetsRequestReducer from './viewAllFacets'
import focusedGranuleReducer from './focusedGranule'
import orderReducer from './order'
import projectPanelsReducer from './projectPanels'
import projectReducer from './project'

export default history => combineReducers({
  authToken: authTokenReducer,
  facetsParams: combineReducers({
    feature: featureFacetsReducer,
    cmr: cmrFacetsReducer,
    viewAll: viewAllFacetsReducer
  }),
  focusedCollection: focusedCollectionReducer,
  focusedGranule: focusedGranuleReducer,
  granuleDownload: granuleDownloadReducer,
  map: mapReducer,
  metadata: combineReducers({
    collections: collectionMetadataReducer,
    granules: granuleMetadataReducer
  }),
  order: orderReducer,
  project: projectReducer,
  projectPanels: projectPanelsReducer,
  query: queryReducer,
  router: connectRouter(history),
  searchResults: combineReducers({
    collections: collectionsResultsReducer,
    facets: facetsReducer,
    granules: granuleResultsReducer,
    viewAllFacets: viewAllFacetsRequestReducer
  }),
  timeline: timelineReducer,
  ui: uiReducer
})
