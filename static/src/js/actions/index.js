/* eslint-disable import/no-cycle */
import { adminIsAuthorized } from './admin/isAuthorized'

import { requeueOrder } from './admin/retrievals'

import {
  fetchAdminRetrievalsMetrics,
  updateAdminRetrievalsMetricsStartDate,
  updateAdminRetrievalsMetricsEndDate
} from './admin/retrievalMetrics'

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
import { getRegions } from './regions'
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
import { generateNotebook } from './generateNotebook'

const actions = {
  adminIsAuthorized,
  changePath,
  changeUrl,
  collectionRelevancyMetrics,
  createSubscription,
  deleteCollectionSubscription,
  deleteSubscription,
  exportSearch,
  fetchAdminRetrievalsMetrics,
  generateNotebook,
  getGranuleSubscriptions,
  getRegions,
  getSubscriptions,
  getViewAllFacets,
  handleAlert,
  onFacetsErrored,
  onFacetsLoaded,
  onFacetsLoading,
  removeSubscriptionDisabledFields,
  requeueOrder,
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
  updateAdminRetrievalsMetricsEndDate,
  updateAdminRetrievalsMetricsStartDate,
  updateFacets,
  updateStore,
  updateSubscription,
  updateSubscriptionDisabledFields
}

export default actions
