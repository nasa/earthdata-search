import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import adminIsAuthorizedReducer from './admin/isAuthorized'
import adminPreferencesMetricsReducer from './admin/preferencesMetrics'
import adminProjectsReducer from './admin/projects'
import adminRetrievalsMetricsReducer from './admin/retrievalsMetrics'
import adminRetrievalsReducer from './admin/retrievals'
import advancedSearchReducer from './advancedSearch'
import authTokenReducer from './authToken'
import autocompleteReducer from './autocomplete'
import collectionMetadataReducer from './collectionMetadata'
import collectionsResultsReducer from './collectionsResults'
import colorMapsReducer from './colorMaps'
import contactInfoReducer from './contactInfo'
import dataQualitySummariesReducer from './dataQualitySummaries'
import earthdataDownloadRedirectReducer from './earthdataDownloadRedirect'
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
import mapReducer from './map'
import panelsReducer from './panels'
import portalsReducer from './portals'
import preferencesReducer from './preferences'
import projectReducer from './project'
import queryReducer from './query'
import regionResultsReducer from './regionResults'
import retrievalReducer from './retrieval'
import savedProjectReducer from './savedProject'
import shapefileReducer from './shapefile'
import subscriptionsReducer from './subscriptions'
import uiReducer from './ui'
import userReducer from './user'
import viewAllFacetsRequestReducer from './viewAllFacets'

export default (history) => combineReducers({
  admin: combineReducers({
    isAuthorized: adminIsAuthorizedReducer,
    preferencesMetrics: adminPreferencesMetricsReducer,
    projects: adminProjectsReducer,
    retrievals: adminRetrievalsReducer,
    retrievalsMetrics: adminRetrievalsMetricsReducer
  }),
  advancedSearch: advancedSearchReducer,
  authToken: authTokenReducer,
  autocomplete: autocompleteReducer,
  contactInfo: contactInfoReducer,
  dataQualitySummaries: dataQualitySummariesReducer,
  earthdataDownloadRedirect: earthdataDownloadRedirectReducer,
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
  map: mapReducer,
  metadata: combineReducers({
    collections: collectionMetadataReducer,
    granules: granuleMetadataReducer,
    colormaps: colorMapsReducer
  }),
  portal: portalsReducer,
  project: projectReducer,
  panels: panelsReducer,
  preferences: preferencesReducer,
  query: queryReducer,
  retrieval: retrievalReducer,
  router: connectRouter(history),
  savedProject: savedProjectReducer,
  searchResults: combineReducers({
    collections: collectionsResultsReducer,
    facets: facetsReducer,
    regions: regionResultsReducer,
    viewAllFacets: viewAllFacetsRequestReducer
  }),
  shapefile: shapefileReducer,
  subscriptions: subscriptionsReducer,
  ui: uiReducer,
  user: userReducer
})
