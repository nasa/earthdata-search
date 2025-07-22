/* eslint-disable import/no-cycle */
import { adminIsAuthorized } from './admin/isAuthorized'
import {
  adminViewRetrieval,
  fetchAdminRetrievals,
  fetchAdminRetrieval,
  requeueOrder,
  updateAdminRetrievalsSortKey,
  updateAdminRetrievalsPageNum
} from './admin/retrievals'

import {
  fetchAdminRetrievalsMetrics,
  updateAdminRetrievalsMetricsStartDate,
  updateAdminRetrievalsMetricsEndDate
} from './admin/retrievalMetrics'

import {
  adminViewProject,
  fetchAdminProjects,
  fetchAdminProject,
  updateAdminProjectsSortKey,
  updateAdminProjectsPageNum
} from './admin/projects'
import { updateAdvancedSearch } from './advancedSearch'
import { getCollections, updateCollectionMetadata } from './collections'
import {
  changeFocusedCollection,
  getFocusedCollection,
  getGranuleSubscriptions,
  updateFocusedCollection,
  viewCollectionGranules,
  viewCollectionDetails
} from './focusedCollection'
import {
  getColorMap,
  setColorMapsErrored,
  setColorMapsLoaded,
  setColorMapsLoading
} from './colorMaps'
import {
  addGranuleMetadata,
  fetchRetrievalCollectionGranuleBrowseLinks,
  fetchRetrievalCollectionGranuleLinks,
  getSearchGranules,
  initializeCollectionGranulesResults,
  updateGranuleMetadata,
  updateGranuleResults
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
import {
  changeFocusedGranule,
  getFocusedGranule,
  updateFocusedGranule
} from './focusedGranule'
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
  getSubscriptions,
  deleteSubscription,
  deleteCollectionSubscription,
  removeSubscriptionDisabledFields,
  updateSubscription,
  updateSubscriptionDisabledFields,
  updateGranuleSubscription
} from './subscriptions'
import { setUserFromJwt } from './user'
import { exportSearch } from './exportSearch'
import { generateNotebook } from './generateNotebook'

const actions = {
  addGranuleMetadata,
  adminIsAuthorized,
  adminViewProject,
  adminViewRetrieval,
  changeFocusedCollection,
  changeFocusedGranule,
  changePath,
  changeUrl,
  collectionRelevancyMetrics,
  createSubscription,
  deleteCollectionSubscription,
  deleteSubscription,
  exportSearch,
  fetchAdminRetrieval,
  fetchAdminRetrievals,
  fetchContactInfo,
  fetchAdminProject,
  fetchAdminProjects,
  fetchRetrieval,
  fetchRetrievalCollection,
  fetchRetrievalCollectionGranuleBrowseLinks,
  fetchRetrievalCollectionGranuleLinks,
  generateNotebook,
  getCollections,
  getColorMap,
  getFocusedCollection,
  getFocusedGranule,
  getGranuleSubscriptions,
  getRegions,
  getSearchGranules,
  getSubscriptions,
  getViewAllFacets,
  handleAlert,
  handleError,
  initializeCollectionGranulesResults,
  logout,
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
  updateAdminRetrievalsPageNum,
  updateAdminRetrievalsSortKey,
  fetchAdminRetrievalsMetrics,
  updateAdminRetrievalsMetricsStartDate,
  updateAdminRetrievalsMetricsEndDate,
  updateAdvancedSearch,
  updateAuthToken,
  updateCollectionMetadata,
  updateFocusedCollection,
  updateFocusedGranule,
  updateGranuleMetadata,
  updateGranuleResults,
  updateGranuleSubscription,
  updateNotificationLevel,
  updateProjectName,
  updateAdminProjectsPageNum,
  updateAdminProjectsSortKey,
  updateSavedProject,
  updateStore,
  updateSubscription,
  updateSubscriptionDisabledFields,
  viewCollectionDetails,
  viewCollectionGranules
}

export default actions
