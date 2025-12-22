import { combineReducers } from 'redux'

import subscriptionsReducer from './subscriptions'

export default () => combineReducers({
  subscriptions: subscriptionsReducer
})
