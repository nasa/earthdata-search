/* eslint-disable import/no-cycle */

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
import { updateAuthToken } from './authToken'
import {
  changeTimelineQuery,
  getTimeline
} from './timeline'
import {
  changeCollectionPageNum,
  changeGranuleGridCoords,
  changeGranulePageNum,
  changeProjectQuery,
  changeQuery,
  clearFilters,
  removeGridFilter,
  removeSpatialFilter,
  removeTemporalFilter,
  updateGranuleQuery
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
  toggleFacetsModal,
  toggleOverrideTemporalModal,
  toggleRelatedUrlsModal,
  toggleDrawingNewLayer,
  toggleSecondaryOverlayPanel,
  toggleSelectingNewGrid,
  toggleShapefileUploadModal
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
  fetchRetrieval,
  submitRetrieval,
  deleteRetrieval
} from './retrieval'
import { fetchRetrievalHistory } from './retrievalHistory'
import {
  fetchAccessMethods
} from './accessMethods'
import {
  saveShapefile,
  shapefileErrored,
  updateShapefile
} from './shapefiles'
import { fetchRetrievalCollection } from './retrievalCollection'
import { loadPortalConfig } from './portals'
import { fetchDataQualitySummaries } from './dataQualitySummaries'
import { deleteSavedProject, updateProjectName, updateSavedProject } from './savedProject'
import { fetchSavedProjects, setSavedProjects } from './savedProjects'

const actions = {
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
  changeTimelineQuery,
  changeUrl,
  changeViewAllFacet,
  clearCollectionGranules,
  clearFilters,
  deleteRetrieval,
  deleteSavedProject,
  excludeGranule,
  fetchAccessMethods,
  fetchDataQualitySummaries,
  fetchRetrievalCollection,
  fetchRetrieval,
  fetchRetrievalCollectionGranuleLinks,
  fetchRetrievalHistory,
  fetchSavedProjects,
  getCollections,
  getFocusedCollection,
  getFocusedGranule,
  getGranules,
  getProjectCollections,
  getProjectGranules,
  getTimeline,
  getViewAllFacets,
  loadPortalConfig,
  masterOverlayPanelDragEnd,
  masterOverlayPanelDragStart,
  masterOverlayPanelResize,
  masterOverlayPanelToggle,
  removeCollectionFromProject,
  removeGridFilter,
  removeSpatialFilter,
  removeTemporalFilter,
  restoreCollections,
  restoreProject,
  saveShapefile,
  selectAccessMethod,
  setSavedProjects,
  shapefileErrored,
  submitRetrieval,
  toggleCollectionVisibility,
  toggleDrawingNewLayer,
  toggleFacetsModal,
  toggleOverrideTemporalModal,
  toggleRelatedUrlsModal,
  toggleSecondaryOverlayPanel,
  toggleSelectingNewGrid,
  toggleShapefileUploadModal,
  triggerViewAllFacets,
  undoExcludeGranule,
  updateAccessMethod,
  updateAuthToken,
  updateCmrFacet,
  updateCollectionGranuleFilters,
  updateFeatureFacet,
  updateGranuleMetadata,
  updateGranuleQuery,
  updateGranuleResults,
  updateProjectName,
  updateSavedProject,
  updateShapefile,
  updateStore,
  viewCollectionDetails,
  viewCollectionGranules
}

export default actions
