import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import adminIsAuthorizedReducer from './admin/isAuthorized'
import adminPreferencesMetricsReducer from './admin/preferencesMetrics'
import adminProjectsReducer from './admin/projects'
import adminRetrievalsMetricsReducer from './admin/retrievalsMetrics'
import adminRetrievalsReducer from './admin/retrievals'
import advancedSearchReducer from './advancedSearch'
import authTokenReducer from './authToken'
import collectionMetadataReducer from './collectionMetadata'
import collectionsResultsReducer from './collectionsResults'
import colorMapsReducer from './colorMaps'
import contactInfoReducer from './contactInfo'
import errorsReducer from './errors'
import facetsReducer from './facets'
import focusedCollectionReducer from './focusedCollection'
import focusedGranuleReducer from './focusedGranule'
import granuleDownloadReducer from './granuleDownload'
import granuleMetadataReducer from './granuleMetadata'
import panelsReducer from './panels'
import queryReducer from './query'
import regionResultsReducer from './regionResults'
import retrievalReducer from './retrieval'
import savedProjectReducer from './savedProject'
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
  contactInfo: contactInfoReducer,
  errors: errorsReducer,
  focusedCollection: focusedCollectionReducer,
  focusedGranule: focusedGranuleReducer,
  granuleDownload: granuleDownloadReducer,
  metadata: combineReducers({
    collections: collectionMetadataReducer,
    granules: granuleMetadataReducer,
    colormaps: colorMapsReducer
  }),
  panels: panelsReducer,
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
  subscriptions: subscriptionsReducer,
  ui: uiReducer,
  user: userReducer
})
