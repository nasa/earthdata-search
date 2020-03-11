import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import collectionMetadataReducer from './collectionMetadata'
import dataQualitySummariesReducer from './dataQualitySummaries'
import granuleMetadataReducer from './granuleMetadata'
import collectionsResultsReducer from './collectionsResults'
import advancedSearchReducer from './advancedSearch'
import authTokenReducer from './authToken'
import facetsReducer from './facets'
import {
  cmrFacetsReducer,
  featureFacetsReducer,
  viewAllFacetsReducer
} from './facetsParams'
import focusedCollectionReducer from './focusedCollection'
import granuleDownloadReducer from './granuleDownload'
import mapReducer from './map'
import queryReducer from './query'
import timelineReducer from './timeline'
import uiReducer from './ui'
import viewAllFacetsRequestReducer from './viewAllFacets'
import focusedGranuleReducer from './focusedGranule'
import retrievalReducer from './retrieval'
import regionResultsReducer from './regionResults'
import retrievalHistoryReducer from './retrievalHistory'
import portalsReducer from './portals'
import projectPanelsReducer from './projectPanels'
import projectReducer from './project'
import shapefileReducer from './shapefile'
import savedProjectReducer from './savedProject'
import savedProjectsReducer from './savedProjects'
import errorsReducer from './errors'
import browserReducer from './browser'
import providersReducer from './providers'
import contactInfoReducer from './contactInfo'
import adminIsAuthorizedReducer from './admin/isAuthorized'
import adminRetrievalsReducer from './admin/retrievals'

export default history => combineReducers({
  admin: combineReducers({
    isAuthorized: adminIsAuthorizedReducer,
    retrievals: adminRetrievalsReducer
  }),
  advancedSearch: advancedSearchReducer,
  authToken: authTokenReducer,
  browser: browserReducer,
  contactInfo: contactInfoReducer,
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
  providers: providersReducer,
  query: queryReducer,
  retrieval: retrievalReducer,
  retrievalHistory: retrievalHistoryReducer,
  router: connectRouter(history),
  savedProject: savedProjectReducer,
  savedProjects: savedProjectsReducer,
  searchResults: combineReducers({
    collections: collectionsResultsReducer,
    facets: facetsReducer,
    regions: regionResultsReducer,
    viewAllFacets: viewAllFacetsRequestReducer
  }),
  shapefile: shapefileReducer,
  timeline: timelineReducer,
  ui: uiReducer
})
