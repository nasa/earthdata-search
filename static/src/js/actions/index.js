/* eslint-disable import/no-cycle */
import {
  adminIsAuthorized,
  adminViewRetrieval,
  fetchAdminRetrievals,
  fetchAdminRetrieval
} from './admin/retrievals'
import {
  updateAdvancedSearch
} from './advancedSearch'
import {
  getCollections,
  restoreCollections,
  updateCollectionGranuleFilters
} from './collections'
import {
  changeFocusedCollection,
  clearCollectionGranules,
  getFocusedCollection,
  viewCollectionGranules,
  viewCollectionDetails
} from './focusedCollection'
import {
  addGranulesFromCollection,
  applyGranuleFilters,
  excludeGranule,
  getGranules,
  undoExcludeGranule,
  fetchRetrievalCollectionGranuleLinks,
  updateGranuleResults,
  updateGranuleMetadata
} from './granules'
import { logout, updateAuthToken } from './authToken'
import {
  changeTimelineQuery,
  getTimeline
} from './timeline'
import {
  changeCollectionPageNum,
  changeGranuleGridCoords,
  changeGranulePageNum,
  changeProjectQuery,
  changeRegionQuery,
  changeQuery,
  clearFilters,
  removeGridFilter,
  removeSpatialFilter,
  removeTemporalFilter,
  updateGranuleQuery,
  updateRegionQuery
} from './search'
import { changeMap } from './map'
import {
  changeUrl,
  changePath,
  updateStore
} from './urlQuery'
import {
  changeCmrFacet,
  updateCmrFacet,
  changeFeatureFacet,
  updateFeatureFacet
} from './facets'
import {
  masterOverlayPanelDragEnd,
  masterOverlayPanelDragStart,
  masterOverlayPanelResize,
  masterOverlayPanelToggle,
  toggleAdvancedSearchModal,
  toggleChunkedOrderModal,
  toggleDrawingNewLayer,
  toggleFacetsModal,
  toggleOverrideTemporalModal,
  toggleRelatedUrlsModal,
  toggleSecondaryOverlayPanel,
  toggleSelectingNewGrid,
  toggleShapefileUploadModal,
  toggleTooManyPointsModal
} from './ui'
import {
  applyViewAllFacets,
  getViewAllFacets,
  changeViewAllFacet,
  triggerViewAllFacets
} from './viewAllFacets'
import {
  changeFocusedGranule,
  getFocusedGranule
} from './focusedGranule'
import {
  addProjectCollection,
  getProjectCollections,
  getProjectGranules,
  removeCollectionFromProject,
  restoreProject,
  selectAccessMethod,
  toggleCollectionVisibility,
  addAccessMethods,
  updateAccessMethod
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

const actions = {
  adminIsAuthorized,
  adminViewRetrieval,
  fetchAdminRetrieval,
  fetchAdminRetrievals,
  addAccessMethods,
  addGranulesFromCollection,
  addProjectCollection,
  applyGranuleFilters,
  applyViewAllFacets,
  changeCmrFacet,
  changeCollectionPageNum,
  changeFeatureFacet,
  changeFocusedCollection,
  changeFocusedGranule,
  changeGranuleGridCoords,
  changeGranulePageNum,
  changeMap,
  changePath,
  changeProjectQuery,
  changeQuery,
  changeRegionQuery,
  changeTimelineQuery,
  changeUrl,
  changeViewAllFacet,
  clearCollectionGranules,
  clearFilters,
  clearShapefile,
  collectionRelevancyMetrics,
  deleteRetrieval,
  deleteSavedProject,
  excludeGranule,
  fetchAccessMethods,
  fetchDataQualitySummaries,
  fetchProviders,
  fetchRetrieval,
  fetchRetrievalCollection,
  fetchRetrievalCollectionGranuleLinks,
  fetchRetrievalHistory,
  fetchSavedProjects,
  fetchContactInfo,
  handleError,
  getCollections,
  getFocusedCollection,
  getFocusedGranule,
  getGranules,
  getProjectCollections,
  getProjectGranules,
  getRegions,
  getTimeline,
  getViewAllFacets,
  loadPortalConfig,
  logout,
  masterOverlayPanelDragEnd,
  masterOverlayPanelDragStart,
  masterOverlayPanelResize,
  masterOverlayPanelToggle,
  removeCollectionFromProject,
  removeGridFilter,
  removeSpatialFilter,
  removeTemporalFilter,
  restoreCollections,
  removeError,
  restoreProject,
  saveShapefile,
  selectAccessMethod,
  setSavedProjects,
  shapefileErrored,
  shapefileLoading,
  submitRetrieval,
  toggleAdvancedSearchModal,
  toggleCollectionVisibility,
  toggleChunkedOrderModal,
  toggleDrawingNewLayer,
  toggleFacetsModal,
  toggleOverrideTemporalModal,
  toggleRelatedUrlsModal,
  toggleSecondaryOverlayPanel,
  toggleSelectingNewGrid,
  toggleShapefileUploadModal,
  toggleTooManyPointsModal,
  triggerViewAllFacets,
  undoExcludeGranule,
  updateAdvancedSearch,
  updateAccessMethod,
  updateAuthToken,
  updateBrowserVersion,
  updateCmrFacet,
  updateCollectionGranuleFilters,
  updateFeatureFacet,
  updateGranuleMetadata,
  updateGranuleQuery,
  updateGranuleResults,
  updateNotificationLevel,
  updateProjectName,
  updateRegionQuery,
  updateSavedProject,
  updateShapefile,
  updateStore,
  viewCollectionDetails,
  viewCollectionGranules
}

export default actions
