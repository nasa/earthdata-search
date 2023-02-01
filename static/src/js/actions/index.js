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
  adminViewProject,
  fetchAdminProjects,
  fetchAdminProject,
  updateAdminProjectsSortKey,
  updateAdminProjectsPageNum
} from './admin/projects'
import {
  updateAdvancedSearch
} from './advancedSearch'
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
import {
  logout,
  updateAuthToken
} from './authToken'
import {
  changeTimelineQuery,
  getTimeline
} from './timeline'
import {
  changeCollectionPageNum,
  changeGranulePageNum,
  changeProjectQuery,
  changeRegionQuery,
  changeQuery,
  clearFilters,
  removeSpatialFilter,
  removeTemporalFilter,
  updateGranuleSearchQuery,
  updateRegionQuery
} from './search'
import { changeMap } from './map'
import {
  changeUrl,
  changePath,
  updateStore
} from './urlQuery'
import {
  addCmrFacet,
  changeCmrFacet,
  changeFeatureFacet,
  removeCmrFacet,
  updateCmrFacet,
  updateFeatureFacet
} from './facets'
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
  toggleRelatedUrlsModal,
  toggleSecondaryOverlayPanel,
  toggleShapefileUploadModal,
  toggleSpatialPolygonWarning,
  toggleTooManyPointsModal,
  toggleKeyboardShortcutsModal,
  toggleTimeline
} from './ui'
import {
  applyViewAllFacets,
  getViewAllFacets,
  changeViewAllFacet,
  triggerViewAllFacets
} from './viewAllFacets'
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
  updateProjectGranuleParams
} from './project'
import {
  fetchProviders
} from './providers'
import {
  getRegions
} from './regions'
import {
  fetchRetrieval,
  submitRetrieval,
  deleteRetrieval
} from './retrieval'
import { fetchRetrievalHistory } from './retrievalHistory'
import {
  fetchAccessMethods
} from './accessMethods'
import {
  clearShapefile,
  fetchShapefile,
  saveShapefile,
  shapefileErrored,
  shapefileLoading,
  updateShapefile
} from './shapefiles'
import { fetchRetrievalCollection } from './retrievalCollection'
import { loadPortalConfig } from './portals'
import { fetchDataQualitySummaries } from './dataQualitySummaries'
import { deleteSavedProject, updateProjectName, updateSavedProject } from './savedProject'
import { fetchSavedProjects, setSavedProjects } from './savedProjects'
import { handleAlert } from './alerts'
import { handleError, removeError } from './errors'
import { updateBrowserVersion } from './browser'
import { collectionRelevancyMetrics } from './relevancy'
import {
  fetchContactInfo,
  setContactInfoFromJwt,
  updateNotificationLevel
} from './contactInfo'
import {
  cancelAutocomplete,
  clearAutocompleteSelected,
  clearAutocompleteSuggestions,
  deleteAutocompleteValue,
  fetchAutocomplete,
  removeAutocompleteValue,
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

const actions = {
  addAccessMethods,
  addCmrFacet,
  addCollectionToProject,
  addGranuleToProjectCollection,
  addProjectCollection,
  adminIsAuthorized,
  adminViewProject,
  adminViewRetrieval,
  applyGranuleFilters,
  applyViewAllFacets,
  cancelAutocomplete,
  changeCmrFacet,
  changeCollectionPageNum,
  changeFeatureFacet,
  changeFocusedCollection,
  changeFocusedGranule,
  changeGranulePageNum,
  changeMap,
  changePath,
  changeProjectGranulePageNum,
  changeProjectQuery,
  changeQuery,
  changeRegionQuery,
  changeTimelineQuery,
  changeUrl,
  changeViewAllFacet,
  clearAutocompleteSelected,
  clearAutocompleteSuggestions,
  clearFilters,
  clearFocusedCollectionGranuleFilters,
  clearGranuleFilters,
  clearShapefile,
  collectionRelevancyMetrics,
  createSubscription,
  deleteAutocompleteValue,
  deleteCollectionSubscription,
  deleteRetrieval,
  deleteSavedProject,
  deleteSubscription,
  excludeGranule,
  exportSearch,
  fetchAccessMethods,
  fetchAdminRetrieval,
  fetchAdminRetrievals,
  fetchAutocomplete,
  fetchContactInfo,
  fetchDataQualitySummaries,
  fetchAdminProject,
  fetchAdminProjects,
  fetchProviders,
  fetchRetrieval,
  fetchRetrievalCollection,
  fetchRetrievalCollectionGranuleBrowseLinks,
  fetchRetrievalCollectionGranuleLinks,
  fetchRetrievalHistory,
  fetchSavedProjects,
  fetchShapefile,
  getCollections,
  getFocusedCollection,
  getFocusedGranule,
  getGranuleSubscriptions,
  getProjectCollections,
  getProjectGranules,
  getRegions,
  getSearchGranules,
  getSubscriptions,
  getTimeline,
  getViewAllFacets,
  handleAlert,
  handleError,
  initializeCollectionGranulesQuery,
  initializeCollectionGranulesResults,
  loadPortalConfig,
  logout,
  onExcludeGranule,
  removeAutocompleteValue,
  removeCmrFacet,
  removeCollectionFromProject,
  removeError,
  removeGranuleFromProjectCollection,
  removeSpatialFilter,
  removeSubscriptionDisabledFields,
  removeTemporalFilter,
  requeueOrder,
  restoreProject,
  saveShapefile,
  selectAccessMethod,
  selectAutocompleteSuggestion,
  setActivePanel,
  setActivePanelGroup,
  setActivePanelSection,
  setContactInfoFromJwt,
  setIsSubmitting,
  setPreferences,
  setPreferencesFromJwt,
  setSavedProjects,
  setUserFromJwt,
  shapefileErrored,
  shapefileLoading,
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
  toggleRelatedUrlsModal,
  toggleSecondaryOverlayPanel,
  toggleShapefileUploadModal,
  toggleSpatialPolygonWarning,
  toggleTimeline,
  toggleTooManyPointsModal,
  triggerViewAllFacets,
  undoExcludeGranule,
  updateAccessMethod,
  updateAdminRetrievalsPageNum,
  updateAdminRetrievalsSortKey,
  updateAdvancedSearch,
  updateAuthToken,
  updateBrowserVersion,
  updateCmrFacet,
  updateCollectionMetadata,
  updateFeatureFacet,
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
  updateShapefile,
  updateStore,
  updateSubscription,
  updateSubscriptionDisabledFields,
  viewCollectionDetails,
  viewCollectionGranules
}

export default actions
