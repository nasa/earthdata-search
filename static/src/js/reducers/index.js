import { combineReducers } from 'redux'

import adminIsAuthorizedReducer from './admin/isAuthorized'
import adminRetrievalsMetricsReducer from './admin/retrievalsMetrics'
import facetsReducer from './facets'
import regionResultsReducer from './regionResults'
import subscriptionsReducer from './subscriptions'
import uiReducer from './ui'
import viewAllFacetsRequestReducer from './viewAllFacets'

export default () => combineReducers({
  admin: combineReducers({
    isAuthorized: adminIsAuthorizedReducer,
    retrievalsMetrics: adminRetrievalsMetricsReducer
  }),
  searchResults: combineReducers({
    facets: facetsReducer,
    regions: regionResultsReducer,
    viewAllFacets: viewAllFacetsRequestReducer
  }),
  subscriptions: subscriptionsReducer,
  ui: uiReducer
})
