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

import { fetchAdminPreferencesMetrics } from './admin/preferencesMetrics'

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
import {
  getCollections,
  clearFocusedCollectionGranuleFilters,
  updateFocusedCollectionGranuleFilters,
  updateCollectionMetadata
} from './collections'
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
  applyGranuleFilters,
  clearGranuleFilters,
  excludeGranule,
  fetchRetrievalCollectionGranuleLinks,
  fetchRetrievalCollectionGranuleBrowseLinks,
  getProjectGranules,
  getSearchGranules,
  initializeCollectionGranulesQuery,
  initializeCollectionGranulesResults,
  onExcludeGranule,
  undoExcludeGranule,
  updateGranuleMetadata,
  updateGranuleResults
} from './granules'
import { logout, updateAuthToken } from './authToken'
import {
  changeCollectionPageNum,
  changeGranulePageNum,
  changeProjectQuery,
  changeRegionQuery,
  changeQuery,
  clearFilters,
  removeSpatialFilter,
  removeTemporalFilter,
  updateCollectionQuery,
  updateGranuleSearchQuery,
  updateRegionQuery
} from './search'
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
import {
  togglePanels,
  setActivePanel,
  setActivePanelGroup,
  setActivePanelSection
} from './panels'
import {
  addAccessMethods,
  addCollectionToProject,
  addGranuleToProjectCollection,
  addProjectCollection,
  changeProjectGranulePageNum,
  getProjectCollections,
  removeCollectionFromProject,
  removeGranuleFromProjectCollection,
  restoreProject,
  selectAccessMethod,
  toggleCollectionVisibility,
  updateAccessMethod,
  updateProjectGranuleParams,
  setDataQualitySummaries
} from './project'
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
  cancelAutocomplete,
  clearAutocompleteSuggestions,
  fetchAutocomplete,
  selectAutocompleteSuggestion
} from './autocomplete'
import {
  setIsSubmitting,
  setPreferences,
  setPreferencesFromJwt,
  updatePreferences
} from './preferences'
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
  addAccessMethods,
  addCollectionToProject,
  addGranuleToProjectCollection,
  addProjectCollection,
  adminIsAuthorized,
  adminViewProject,
  adminViewRetrieval,
  applyGranuleFilters,
  cancelAutocomplete,
  changeCollectionPageNum,
  changeFocusedCollection,
  changeFocusedGranule,
  changeGranulePageNum,
  changePath,
  changeProjectGranulePageNum,
  changeProjectQuery,
  changeQuery,
  changeRegionQuery,
  changeUrl,
  clearAutocompleteSuggestions,
  clearFilters,
  clearFocusedCollectionGranuleFilters,
  clearGranuleFilters,
  collectionRelevancyMetrics,
  createSubscription,
  deleteCollectionSubscription,
  deleteSubscription,
  excludeGranule,
  exportSearch,
  fetchAdminRetrieval,
  fetchAdminRetrievals,
  fetchAutocomplete,
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
  getProjectCollections,
  getProjectGranules,
  getRegions,
  getSearchGranules,
  getSubscriptions,
  getViewAllFacets,
  handleAlert,
  handleError,
  initializeCollectionGranulesQuery,
  initializeCollectionGranulesResults,
  logout,
  onExcludeGranule,
  removeCollectionFromProject,
  removeError,
  removeGranuleFromProjectCollection,
  removeSpatialFilter,
  removeSubscriptionDisabledFields,
  removeTemporalFilter,
  requeueOrder,
  restoreProject,
  selectAccessMethod,
  selectAutocompleteSuggestion,
  setActivePanel,
  setActivePanelGroup,
  setActivePanelSection,
  setColorMapsErrored,
  setColorMapsLoaded,
  setColorMapsLoading,
  setContactInfoFromJwt,
  setDataQualitySummaries,
  setIsSubmitting,
  setPreferences,
  setPreferencesFromJwt,
  setUserFromJwt,
  submitRetrieval,
  toggleAboutCSDAModal,
  toggleAboutCwicModal,
  toggleAdvancedSearchModal,
  toggleChunkedOrderModal,
  toggleCollectionVisibility,
  toggleDeprecatedParameterModal,
  toggleDrawingNewLayer,
  toggleEditSubscriptionModal,
  toggleFacetsModal,
  toggleKeyboardShortcutsModal,
  toggleOverrideTemporalModal,
  togglePanels,
  togglePortalBrowserModal,
  toggleRelatedUrlsModal,
  toggleSecondaryOverlayPanel,
  toggleShapefileUploadModal,
  toggleSpatialPolygonWarning,
  toggleTimeline,
  toggleTooManyPointsModal,
  undoExcludeGranule,
  updateAccessMethod,
  updateAdminRetrievalsPageNum,
  updateAdminRetrievalsSortKey,
  fetchAdminPreferencesMetrics,
  fetchAdminRetrievalsMetrics,
  updateAdminRetrievalsMetricsStartDate,
  updateAdminRetrievalsMetricsEndDate,
  updateAdvancedSearch,
  updateAuthToken,
  updateCollectionMetadata,
  updateCollectionQuery,
  updateFocusedCollection,
  updateFocusedCollectionGranuleFilters,
  updateFocusedGranule,
  updateGranuleMetadata,
  updateGranuleResults,
  updateGranuleSearchQuery,
  updateGranuleSubscription,
  updateNotificationLevel,
  updatePreferences,
  updateProjectGranuleParams,
  updateProjectName,
  updateAdminProjectsPageNum,
  updateAdminProjectsSortKey,
  updateRegionQuery,
  updateSavedProject,
  updateStore,
  updateSubscription,
  updateSubscriptionDisabledFields,
  viewCollectionDetails,
  viewCollectionGranules
}

export default actions
