import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import collectionsReducer from './collections'
import facetsReducer from './facets'
import {
  cmrFacetsReducer,
  featureFacetsReducer
} from './facetsParams'
import focusedCollectionReducer from './focusedCollection'
import granulesReducer from './granules'
import mapReducer from './map'
import queryReducer from './query'
import uiReducer from './ui'

export default history => combineReducers({
  entities: combineReducers({
    collections: collectionsReducer,
    facets: facetsReducer,
    granules: granulesReducer
  }),
  facetsParams: combineReducers({
    feature: featureFacetsReducer,
    cmr: cmrFacetsReducer
  }),
  focusedCollection: focusedCollectionReducer,
  map: mapReducer,
  query: queryReducer,
  router: connectRouter(history),
  ui: uiReducer
})
