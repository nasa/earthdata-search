import { combineReducers } from 'redux'

import adminIsAuthorizedReducer from './admin/isAuthorized'
import adminRetrievalsMetricsReducer from './admin/retrievalsMetrics'
import colorMapsReducer from './colorMaps'
import authTokenReducer from './authToken'
import contactInfoReducer from './contactInfo'
import facetsReducer from './facets'
import granuleDownloadReducer from './granuleDownload'
import regionResultsReducer from './regionResults'
import retrievalReducer from './retrieval'
import subscriptionsReducer from './subscriptions'
import uiReducer from './ui'
import viewAllFacetsRequestReducer from './viewAllFacets'

export default () => combineReducers({
  admin: combineReducers({
    isAuthorized: adminIsAuthorizedReducer,
    retrievalsMetrics: adminRetrievalsMetricsReducer
  }),
  granuleDownload: granuleDownloadReducer,
  metadata: combineReducers({
  }),
  retrieval: retrievalReducer,
  searchResults: combineReducers({
    facets: facetsReducer,
    regions: regionResultsReducer,
    viewAllFacets: viewAllFacetsRequestReducer
  }),
  subscriptions: subscriptionsReducer,
  ui: uiReducer
})
