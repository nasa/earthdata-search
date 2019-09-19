import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import collectionMetadataReducer from './collectionMetadata'
import dataQualitySummariesReducer from './dataQualitySummaries'
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
import retrievalReducer from './retrieval'
import retrievalHistoryReducer from './retrievalHistory'
import portalsReducer from './portals'
import projectPanelsReducer from './projectPanels'
import projectReducer from './project'
import shapefileReducer from './shapefile'
import savedProjectReducer from './savedProject'
import savedProjectsReducer from './savedProjects'
import errorsReducer from './errors'
import browserReducer from './browser'

export default history => combineReducers({
  authToken: authTokenReducer,
  browser: browserReducer,
  dataQualitySummaries: dataQualitySummariesReducer,
  errors: errorsReducer,
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
  portal: portalsReducer,
  project: projectReducer,
  projectPanels: projectPanelsReducer,
  query: queryReducer,
  retrieval: retrievalReducer,
  retrievalHistory: retrievalHistoryReducer,
  router: connectRouter(history),
  savedProject: savedProjectReducer,
  savedProjects: savedProjectsReducer,
  searchResults: combineReducers({
    collections: collectionsResultsReducer,
    facets: facetsReducer,
    granules: granuleResultsReducer,
    viewAllFacets: viewAllFacetsRequestReducer
  }),
  shapefile: shapefileReducer,
  timeline: timelineReducer,
  ui: uiReducer
})
