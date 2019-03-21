import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import collectionsReducer from './collections'
import facetsReducer from './facets'
import granulesReducer from './granules'
import queryReducer from './query'
import mapReducer from './map'

export default history => combineReducers({
  router: connectRouter(history),
  query: queryReducer,
  map: mapReducer,
  entities: combineReducers({
    collections: collectionsReducer,
    facets: facetsReducer,
    granules: granulesReducer
  })
})
