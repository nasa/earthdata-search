import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import collectionsReducer from './collections'
import facetsReducer from './facets'
import granulesReducer from './granules'
import queryReducer from './query'

export default history => combineReducers({
  router: connectRouter(history),
  query: queryReducer,
  entities: combineReducers({
    collections: collectionsReducer,
    facets: facetsReducer,
    granules: granulesReducer
  })
})
