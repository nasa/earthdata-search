// eslint-disable-rule no-unused-vars
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension'
import { metricsMiddleware } from '../middleware/metrics'

let store

export const configureStore = (initialState = {}) => {
  // If we already have a redux store defined, return it
  if (store) return store

  // Create the redux store and immediately dispatch the actions we want to occur on load
  store = createStore(
    () => {},
    initialState,

    // Build out the Redux middleware
    composeWithDevTools(
      applyMiddleware(metricsMiddleware, thunk)
    )
  )

  return store
}

export default configureStore
