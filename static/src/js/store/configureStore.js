import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension'

import createRootReducer from '../reducers'
import { metricsMiddleware } from '../middleware/metrics'

import history from '../util/history'

// Set up the initial state
const initialState = {}

// Build the Redux store
const store = createStore(
  createRootReducer(history),
  initialState,

  // Build out the Redux middleware
  composeWithDevTools(
    applyMiddleware(routerMiddleware(history), metricsMiddleware, thunk)
  )
)

export default store
