/* eslint-disable import/no-cycle */
import { adminIsAuthorized } from './admin/isAuthorized'
import {
  adminViewRetrieval,
  fetchAdminRetrievals,
  fetchAdminRetrieval,
  updateAdminRetrievalsSortKey,
  updateAdminRetrievalsPageNum
} from './admin/retrievals'
import {
  updateAdvancedSearch
} from './advancedSearch'
import {
  getCollections,
  updateFocusedCollectionGranuleFilters,
  updateCollectionMetadata
} from './collections'
import {
  changeFocusedCollection,
  getFocusedCollection,
  updateFocusedCollection,
  viewCollectionGranules,
  viewCollectionDetails
} from './focusedCollection'
import {
  applyGranuleFilters,
  excludeGranule,
  fetchRetrievalCollectionGranuleLinks,
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
  updateAuthToken,
  updateAuthTokenFromHeaders
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
  removeGridFilter,
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
  toggleAboutCwicModal,
  toggleChunkedOrderModal,
  toggleDrawingNewLayer,
  toggleFacetsModal,
  toggleOverrideTemporalModal,
  toggleRelatedUrlsModal,
  toggleSecondaryOverlayPanel,
  toggleSelectingNewGrid,
  toggleShapefileUploadModal,
  toggleSpatialPolygonWarning,
  toggleTooManyPointsModal,
  toggleKeyboardShortcutsModal
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
import { handleError, removeError } from './errors'
import { updateBrowserVersion } from './browser'
import { collectionRelevancyMetrics } from './relevancy'
import { fetchContactInfo, updateNotificationLevel } from './contactInfo'
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

const actions = {
  addAccessMethods,
  addCmrFacet,
  addCollectionToProject,
  addGranuleToProjectCollection,
  addProjectCollection,
  adminIsAuthorized,
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
  clearShapefile,
  collectionRelevancyMetrics,
  deleteAutocompleteValue,
  deleteRetrieval,
  deleteSavedProject,
  excludeGranule,
  fetchAccessMethods,
  fetchAdminRetrieval,
  fetchAdminRetrievals,
  fetchAutocomplete,
  fetchContactInfo,
  fetchDataQualitySummaries,
  fetchProviders,
  fetchRetrieval,
  fetchRetrievalCollection,
  fetchRetrievalCollectionGranuleLinks,
  fetchRetrievalHistory,
  fetchSavedProjects,
  fetchShapefile,
  getCollections,
  getFocusedCollection,
  getFocusedGranule,
  getProjectCollections,
  getProjectGranules,
  getRegions,
  getSearchGranules,
  getTimeline,
  getViewAllFacets,
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
  removeGridFilter,
  removeSpatialFilter,
  removeTemporalFilter,
  restoreProject,
  saveShapefile,
  selectAccessMethod,
  selectAutocompleteSuggestion,
  setActivePanel,
  setActivePanelGroup,
  setActivePanelSection,
  setIsSubmitting,
  setPreferences,
  setPreferencesFromJwt,
  setSavedProjects,
  shapefileErrored,
  shapefileLoading,
  submitRetrieval,
  toggleAboutCwicModal,
  toggleAdvancedSearchModal,
  toggleChunkedOrderModal,
  toggleCollectionVisibility,
  toggleDrawingNewLayer,
  toggleFacetsModal,
  toggleKeyboardShortcutsModal,
  toggleOverrideTemporalModal,
  togglePanels,
  toggleRelatedUrlsModal,
  toggleSecondaryOverlayPanel,
  toggleSelectingNewGrid,
  toggleShapefileUploadModal,
  toggleSpatialPolygonWarning,
  toggleTooManyPointsModal,
  triggerViewAllFacets,
  undoExcludeGranule,
  updateAccessMethod,
  updateAdminRetrievalsPageNum,
  updateAdminRetrievalsSortKey,
  updateAdvancedSearch,
  updateAuthToken,
  updateAuthTokenFromHeaders,
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
  updateNotificationLevel,
  updatePreferences,
  updateProjectGranuleParams,
  updateProjectName,
  updateRegionQuery,
  updateSavedProject,
  updateShapefile,
  updateStore,
  viewCollectionDetails,
  viewCollectionGranules
}

export default actions
