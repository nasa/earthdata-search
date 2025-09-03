/* eslint-disable import/no-cycle */
import { adminIsAuthorized } from './admin/isAuthorized'

import { requeueOrder } from './admin/retrievals'

import {
  fetchAdminRetrievalsMetrics,
  updateAdminRetrievalsMetricsStartDate,
  updateAdminRetrievalsMetricsEndDate
} from './admin/retrievalMetrics'

import {
  adminViewProject,
  fetchAdminProjects,
  fetchAdminProject,
  updateAdminProjectsPageNum,
  updateAdminProjectsSortKey
} from './admin/projects'
import {
  updateFacets,
  onFacetsLoading,
  onFacetsLoaded,
  onFacetsErrored
} from './facets'
import { getNlpCollections } from './nlpCollections'
import {
  getColorMap,
  setColorMapsErrored,
  setColorMapsLoaded,
  setColorMapsLoading
} from './colorMaps'
import {
  fetchRetrievalCollectionGranuleBrowseLinks,
  fetchRetrievalCollectionGranuleLinks
} from './granules'
import { logout, updateAuthToken } from './authToken'
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
import { fetchRetrieval, submitRetrieval } from './retrieval'
import { fetchRetrievalCollection } from './retrievalCollection'
import { updateProjectName, updateSavedProject } from './savedProject'
import { handleAlert } from './alerts'
import { handleError, removeError } from './errors'
import { collectionRelevancyMetrics } from './relevancy'
import {
  fetchContactInfo,
  setContactInfoFromJwt,
  updateNotificationLevel
} from './contactInfo'
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
import { setUserFromJwt } from './user'
import { exportSearch } from './exportSearch'
import { generateNotebook } from './generateNotebook'

const actions = {
  adminIsAuthorized,
  adminViewProject,
  changePath,
  changeUrl,
  collectionRelevancyMetrics,
  createSubscription,
  deleteCollectionSubscription,
  deleteSubscription,
  exportSearch,
  fetchContactInfo,
  fetchAdminProject,
  fetchAdminProjects,
  fetchAdminRetrievalsMetrics,
  fetchRetrieval,
  fetchRetrievalCollection,
  fetchRetrievalCollectionGranuleBrowseLinks,
  fetchRetrievalCollectionGranuleLinks,
  generateNotebook,
  getNlpCollections,
  getColorMap,
  getGranuleSubscriptions,
  getRegions,
  getSubscriptions,
  getViewAllFacets,
  handleAlert,
  handleError,
  logout,
  onFacetsErrored,
  onFacetsLoaded,
  onFacetsLoading,
  removeError,
  removeSubscriptionDisabledFields,
  requeueOrder,
  setColorMapsErrored,
  setColorMapsLoaded,
  setColorMapsLoading,
  setContactInfoFromJwt,
  setUserFromJwt,
  submitRetrieval,
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
  updateAdminRetrievalsMetricsStartDate,
  updateAdminRetrievalsMetricsEndDate,
  updateAuthToken,
  updateFacets,
  updateNotificationLevel,
  updateProjectName,
  updateAdminProjectsPageNum,
  updateAdminProjectsSortKey,
  updateSavedProject,
  updateStore,
  updateSubscription,
  updateSubscriptionDisabledFields
}

export default actions
