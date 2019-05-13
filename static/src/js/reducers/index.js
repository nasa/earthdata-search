import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import collectionsReducer from './collections'
import collectionsResultsReducer from './collectionsResults'
import facetsReducer from './facets'
import {
  cmrFacetsReducer,
  featureFacetsReducer,
  viewAllFacetsReducer
} from './facetsParams'
import focusedCollectionReducer from './focusedCollection'
import granulesReducer from './granules'
import mapReducer from './map'
import queryReducer from './query'
import uiReducer from './ui'
import timelineReducer from './timeline'
import viewAllFacetsRequestReducer from './viewAllFacets'

export default history => combineReducers({
  collections: collectionsReducer,
  facetsParams: combineReducers({
    feature: featureFacetsReducer,
    cmr: cmrFacetsReducer,
    viewAll: viewAllFacetsReducer
  }),
  focusedCollection: focusedCollectionReducer,
  map: mapReducer,
  query: queryReducer,
  router: connectRouter(history),
  searchResults: combineReducers({
    collections: collectionsResultsReducer,
    facets: facetsReducer,
    granules: granulesReducer,
    viewAllFacets: viewAllFacetsRequestReducer
  }),
  timeline: timelineReducer,
  ui: uiReducer
})
