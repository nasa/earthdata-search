import { combineReducers } from 'redux'

import adminIsAuthorizedReducer from './admin/isAuthorized'
import adminProjectsReducer from './admin/projects'
import adminRetrievalsMetricsReducer from './admin/retrievalsMetrics'
import authTokenReducer from './authToken'
import colorMapsReducer from './colorMaps'
import contactInfoReducer from './contactInfo'
import errorsReducer from './errors'
import facetsReducer from './facets'
import granuleDownloadReducer from './granuleDownload'
import regionResultsReducer from './regionResults'
import retrievalReducer from './retrieval'
import savedProjectReducer from './savedProject'
import subscriptionsReducer from './subscriptions'
import uiReducer from './ui'
import userReducer from './user'
import viewAllFacetsRequestReducer from './viewAllFacets'

export default () => combineReducers({
  admin: combineReducers({
    isAuthorized: adminIsAuthorizedReducer,
    projects: adminProjectsReducer,
    retrievalsMetrics: adminRetrievalsMetricsReducer
  }),
  authToken: authTokenReducer,
  contactInfo: contactInfoReducer,
  errors: errorsReducer,
  granuleDownload: granuleDownloadReducer,
  metadata: combineReducers({
    colormaps: colorMapsReducer
  }),
  retrieval: retrievalReducer,
  savedProject: savedProjectReducer,
  searchResults: combineReducers({
    facets: facetsReducer,
    regions: regionResultsReducer,
    viewAllFacets: viewAllFacetsRequestReducer
  }),
  subscriptions: subscriptionsReducer,
  ui: uiReducer,
  user: userReducer
})
