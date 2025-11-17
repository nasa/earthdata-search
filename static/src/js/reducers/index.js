import { combineReducers } from 'redux'

import adminIsAuthorizedReducer from './admin/isAuthorized'
import colorMapsReducer from './colorMaps'
import facetsReducer from './facets'
import regionResultsReducer from './regionResults'
import subscriptionsReducer from './subscriptions'
import uiReducer from './ui'
import viewAllFacetsRequestReducer from './viewAllFacets'

export default () => combineReducers({
  admin: combineReducers({
    isAuthorized: adminIsAuthorizedReducer
  }),
  searchResults: combineReducers({
    facets: facetsReducer,
    regions: regionResultsReducer,
    viewAllFacets: viewAllFacetsRequestReducer
  }),
  subscriptions: subscriptionsReducer,
  ui: uiReducer
})
