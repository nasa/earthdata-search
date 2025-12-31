import {
  changeUrl,
  changePath,
  updateStore
} from './urlQuery'
import {
  createSubscription,
  deleteCollectionSubscription,
  deleteSubscription,
  getGranuleSubscriptions,
  getSubscriptions,
  removeSubscriptionDisabledFields,
  updateSubscription,
  updateSubscriptionDisabledFields
} from './subscriptions'

const actions = {
  changePath,
  changeUrl,
  createSubscription,
  deleteCollectionSubscription,
  deleteSubscription,
  getGranuleSubscriptions,
  getSubscriptions,
  removeSubscriptionDisabledFields,
  updateStore,
  updateSubscription,
  updateSubscriptionDisabledFields
}

export default actions
