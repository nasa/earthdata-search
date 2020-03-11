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
  addAccessMethods,
  addProjectCollection,
  adminIsAuthorized,
  adminViewRetrieval,
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
  fetchAdminRetrieval,
  fetchAdminRetrievals,
  fetchContactInfo,
  fetchDataQualitySummaries,
  fetchProviders,
  fetchRetrieval,
  fetchRetrievalCollection,
  fetchRetrievalCollectionGranuleLinks,
  fetchRetrievalHistory,
  fetchSavedProjects,
  getCollections,
  getFocusedCollection,
  getFocusedGranule,
  getGranules,
  getProjectCollections,
  getRegions,
  getTimeline,
  getViewAllFacets,
  handleError,
  loadPortalConfig,
  logout,
  masterOverlayPanelDragEnd,
  masterOverlayPanelDragStart,
  masterOverlayPanelResize,
  masterOverlayPanelToggle,
  removeCollectionFromProject,
  removeError,
  removeGridFilter,
  removeSpatialFilter,
  removeTemporalFilter,
  restoreCollections,
  restoreProject,
  saveShapefile,
  selectAccessMethod,
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
  toggleOverrideTemporalModal,
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
