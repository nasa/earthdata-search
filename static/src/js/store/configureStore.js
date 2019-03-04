import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension'
import { urlQueryMiddleware, urlQueryReducer } from 'react-url-query'

import createRootReducer from '../reducers'

import history from '../util/history'

// Set up the initial state
const initialState = {}

// Build the Redux store
const store = createStore(
  createRootReducer(history),
  initialState,

  // Build out the Redux middleware
  composeWithDevTools(
    applyMiddleware(

      // Set up Redux's connection with React Router
      routerMiddleware(history),
    ),

    // Add the Redux Thunk middleware
    applyMiddleware(thunk),

    applyMiddleware(urlQueryMiddleware({ reducer: urlQueryReducer }))
  ),
)

export default store
