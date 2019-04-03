import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import collectionsReducer from './collections'
import facetsReducer from './facets'
import granulesReducer from './granules'
import queryReducer from './query'
import mapReducer from './map'
import focusedCollectionReducer from './focusedCollection'
import facetsParamsReducer from './facetsParams'
import uiReducer from './ui'

export default history => combineReducers({
  router: connectRouter(history),
  query: queryReducer,
  map: mapReducer,
  focusedCollection: focusedCollectionReducer,
  entities: combineReducers({
    collections: collectionsReducer,
    facets: facetsReducer,
    granules: granulesReducer
  }),
  facetsParams: facetsParamsReducer,
  ui: uiReducer
})
