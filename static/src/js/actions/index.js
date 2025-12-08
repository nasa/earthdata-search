import {
  updateFacets,
  onFacetsLoading,
  onFacetsLoaded,
  onFacetsErrored
} from './facets'

import {
  changeUrl,
  changePath,
  updateStore
} from './urlQuery'
import { toggleFacetsModal } from './ui'
import { getViewAllFacets } from './viewAllFacets'
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
  getViewAllFacets,
  handleAlert,
  onFacetsErrored,
  onFacetsLoaded,
  onFacetsLoading,
  removeSubscriptionDisabledFields,
  toggleFacetsModal,
  updateFacets,
  updateStore,
  updateSubscription,
  updateSubscriptionDisabledFields
}

export default actions
