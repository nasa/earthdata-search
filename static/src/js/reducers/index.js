import { combineReducers } from 'redux'

import adminIsAuthorizedReducer from './admin/isAuthorized'
import adminRetrievalsMetricsReducer from './admin/retrievalsMetrics'
import authTokenReducer from './authToken'
import colorMapsReducer from './colorMaps'
import contactInfoReducer from './contactInfo'
import facetsReducer from './facets'
import granuleDownloadReducer from './granuleDownload'
import regionResultsReducer from './regionResults'
import retrievalReducer from './retrieval'
import subscriptionsReducer from './subscriptions'
import uiReducer from './ui'
import userReducer from './user'
import viewAllFacetsRequestReducer from './viewAllFacets'

export default () => combineReducers({
  admin: combineReducers({
    isAuthorized: adminIsAuthorizedReducer,
    retrievalsMetrics: adminRetrievalsMetricsReducer
  }),
  authToken: authTokenReducer,
  contactInfo: contactInfoReducer,
  granuleDownload: granuleDownloadReducer,
  metadata: combineReducers({
    colormaps: colorMapsReducer
  }),
  retrieval: retrievalReducer,
  searchResults: combineReducers({
    facets: facetsReducer,
    regions: regionResultsReducer,
    viewAllFacets: viewAllFacetsRequestReducer
  }),
  subscriptions: subscriptionsReducer,
  ui: uiReducer,
  user: userReducer
})
