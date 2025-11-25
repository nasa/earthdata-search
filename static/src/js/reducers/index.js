import { combineReducers } from 'redux'

import facetsReducer from './facets'
import regionResultsReducer from './regionResults'
import subscriptionsReducer from './subscriptions'
import uiReducer from './ui'
import viewAllFacetsRequestReducer from './viewAllFacets'

export default () => combineReducers({
  searchResults: combineReducers({
    facets: facetsReducer,
    regions: regionResultsReducer,
    viewAllFacets: viewAllFacetsRequestReducer
  }),
  subscriptions: subscriptionsReducer,
  ui: uiReducer
})
