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
import {
  toggleAdvancedSearchModal,
  toggleAboutCSDAModal,
  toggleAboutCwicModal,
  toggleChunkedOrderModal,
  toggleDeprecatedParameterModal,
  toggleDrawingNewLayer,
  toggleEditSubscriptionModal,
  toggleFacetsModal,
  toggleOverrideTemporalModal,
  togglePortalBrowserModal,
  toggleRelatedUrlsModal,
  toggleSecondaryOverlayPanel,
  toggleShapefileUploadModal,
  toggleSpatialPolygonWarning,
  toggleTooManyPointsModal,
  toggleKeyboardShortcutsModal,
  toggleTimeline
} from './ui'
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
import { exportSearch } from './exportSearch'

const actions = {
  changePath,
  changeUrl,
  collectionRelevancyMetrics,
  createSubscription,
  deleteCollectionSubscription,
  deleteSubscription,
  exportSearch,
  getGranuleSubscriptions,
  getSubscriptions,
  getViewAllFacets,
  handleAlert,
  onFacetsErrored,
  onFacetsLoaded,
  onFacetsLoading,
  removeSubscriptionDisabledFields,
  toggleAboutCSDAModal,
  toggleAboutCwicModal,
  toggleAdvancedSearchModal,
  toggleChunkedOrderModal,
  toggleDeprecatedParameterModal,
  toggleDrawingNewLayer,
  toggleEditSubscriptionModal,
  toggleFacetsModal,
  toggleKeyboardShortcutsModal,
  toggleOverrideTemporalModal,
  togglePortalBrowserModal,
  toggleRelatedUrlsModal,
  toggleSecondaryOverlayPanel,
  toggleShapefileUploadModal,
  toggleSpatialPolygonWarning,
  toggleTimeline,
  toggleTooManyPointsModal,
  updateFacets,
  updateStore,
  updateSubscription,
  updateSubscriptionDisabledFields
}

export default actions
