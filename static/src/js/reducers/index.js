import { combineReducers } from 'redux'

import facetsReducer from './facets'
import subscriptionsReducer from './subscriptions'
import viewAllFacetsRequestReducer from './viewAllFacets'

export default () => combineReducers({
  searchResults: combineReducers({
    facets: facetsReducer,
    viewAllFacets: viewAllFacetsRequestReducer
  }),
  subscriptions: subscriptionsReducer
})
