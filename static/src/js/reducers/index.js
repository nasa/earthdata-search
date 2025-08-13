import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import adminIsAuthorizedReducer from './admin/isAuthorized'
import adminProjectsReducer from './admin/projects'
import adminRetrievalsMetricsReducer from './admin/retrievalsMetrics'
import advancedSearchReducer from './advancedSearch'
import authTokenReducer from './authToken'
import collectionMetadataReducer from './collectionMetadata'
import collectionsResultsReducer from './collectionsResults'
import colorMapsReducer from './colorMaps'
import contactInfoReducer from './contactInfo'
import errorsReducer from './errors'
import facetsReducer from './facets'
import granuleDownloadReducer from './granuleDownload'
import granuleMetadataReducer from './granuleMetadata'
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
    projects: adminProjectsReducer,
    retrievalsMetrics: adminRetrievalsMetricsReducer
  }),
  advancedSearch: advancedSearchReducer,
  authToken: authTokenReducer,
  contactInfo: contactInfoReducer,
  errors: errorsReducer,
  granuleDownload: granuleDownloadReducer,
  metadata: combineReducers({
    collections: collectionMetadataReducer,
    granules: granuleMetadataReducer,
    colormaps: colorMapsReducer
  }),
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
