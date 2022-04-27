// eslint-disable-rule no-unused-vars
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from '@redux-devtools/extension'

import { updateBrowserVersion } from '../actions/browser'
import createRootReducer from '../reducers'
import { metricsMiddleware } from '../middleware/metrics'

import history from '../util/history'

// Set up the initial state
const initialState = {}

let store

export const configureStore = () => {
  // If we already have a redux store defined, return it
  if (store) return store

  // Create the redux store and immediatly dispatch the actions we want to occur on load
  store = createStore(
    createRootReducer(history),
    initialState,

    // Build out the Redux middleware
    composeWithDevTools(
      applyMiddleware(routerMiddleware(history), metricsMiddleware, thunk)
    )
  )

  // Set the browser version on the store
  store.dispatch(updateBrowserVersion())

  return store
}

export default configureStore
