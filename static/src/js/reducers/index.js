import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import adminIsAuthorizedReducer from './admin/isAuthorized'
import adminRetrievalsReducer from './admin/retrievals'
import advancedSearchReducer from './advancedSearch'
import authTokenReducer from './authToken'
import autocompleteReducer from './autocomplete'
import browserReducer from './browser'
import collectionMetadataReducer from './collectionMetadata'
import collectionsResultsReducer from './collectionsResults'
import contactInfoReducer from './contactInfo'
import dataQualitySummariesReducer from './dataQualitySummaries'
import earthdataEnvironmentReducer from './earthdataEnvironment'
import errorsReducer from './errors'
import {
  cmrFacetsReducer,
  featureFacetsReducer,
  viewAllFacetsReducer
} from './facetsParams'
import facetsReducer from './facets'
import focusedCollectionReducer from './focusedCollection'
import focusedGranuleReducer from './focusedGranule'
import granuleDownloadReducer from './granuleDownload'
import granuleMetadataReducer from './granuleMetadata'
import handoffsReducer from './handoffs'
import mapReducer from './map'
import panelsReducer from './panels'
import portalsReducer from './portals'
import preferencesReducer from './preferences'
import projectReducer from './project'
import providersReducer from './providers'
import queryReducer from './query'
import regionResultsReducer from './regionResults'
import retrievalHistoryReducer from './retrievalHistory'
import retrievalReducer from './retrieval'
import savedProjectReducer from './savedProject'
import savedProjectsReducer from './savedProjects'
import shapefileReducer from './shapefile'
import subscriptionsReducer from './subscriptions'
import timelineReducer from './timeline'
import uiReducer from './ui'
import userReducer from './user'
import viewAllFacetsRequestReducer from './viewAllFacets'

export default (history) => combineReducers({
  admin: combineReducers({
    isAuthorized: adminIsAuthorizedReducer,
    retrievals: adminRetrievalsReducer
  }),
  advancedSearch: advancedSearchReducer,
  authToken: authTokenReducer,
  autocomplete: autocompleteReducer,
  browser: browserReducer,
  contactInfo: contactInfoReducer,
  dataQualitySummaries: dataQualitySummariesReducer,
  earthdataEnvironment: earthdataEnvironmentReducer,
  errors: errorsReducer,
  facetsParams: combineReducers({
    feature: featureFacetsReducer,
    cmr: cmrFacetsReducer,
    viewAll: viewAllFacetsReducer
  }),
  focusedCollection: focusedCollectionReducer,
  focusedGranule: focusedGranuleReducer,
  granuleDownload: granuleDownloadReducer,
  handoffs: handoffsReducer,
  map: mapReducer,
  metadata: combineReducers({
    collections: collectionMetadataReducer,
    granules: granuleMetadataReducer
  }),
  portal: portalsReducer,
  project: projectReducer,
  panels: panelsReducer,
  preferences: preferencesReducer,
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
  subscriptions: subscriptionsReducer,
  timeline: timelineReducer,
  ui: uiReducer,
  user: userReducer
})
