import {
  changeUrl,
  changePath,
  updateStore
} from './urlQuery'
import { handleAlert } from './alerts'
import { collectionRelevancyMetrics } from './relevancy'
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
  collectionRelevancyMetrics,
  createSubscription,
  deleteCollectionSubscription,
  deleteSubscription,
  getGranuleSubscriptions,
  getSubscriptions,
  handleAlert,
  removeSubscriptionDisabledFields,
  updateStore,
  updateSubscription,
  updateSubscriptionDisabledFields
}

export default actions
