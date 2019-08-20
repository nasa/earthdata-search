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
  setGranuleDownloadParams,
  updateGranuleResults,
  updateGranuleMetadata
} from './granules'
import { updateAuthToken } from './authToken'
import {
  changeTimelineQuery,
  getTimeline
} from './timeline'
import { searchNlp } from './nlp'
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
import { changeUrl, changePath } from './urlQuery'
import {
  changeCmrFacet,
  updateCmrFacet,
  changeFeatureFacet,
  updateFeatureFacet
} from './facets'
import {
  granuleResultsPanelUpdateSearchValue,
  granuleResultsPanelUpdateSortOrder,
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
import { fetchRetrieval, submitRetrieval } from './retrieval'
import {
  fetchAccessMethods
} from './accessMethods'
import {
  saveShapefile,
  shapefileErrored,
  updateShapefile
} from './shapefiles'
import { fetchRetrievalCollection } from './retrievalCollection'
import { restorePortal } from './portals'

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
  excludeGranule,
  fetchAccessMethods,
  fetchRetrievalCollection,
  fetchRetrieval,
  getCollections,
  getFocusedCollection,
  getFocusedGranule,
  getGranules,
  getProjectCollections,
  getProjectGranules,
  getTimeline,
  getViewAllFacets,
  granuleResultsPanelUpdateSearchValue,
  granuleResultsPanelUpdateSortOrder,
  masterOverlayPanelDragEnd,
  masterOverlayPanelDragStart,
  masterOverlayPanelResize,
  masterOverlayPanelToggle,
  removeCollectionFromProject,
  removeGridFilter,
  removeSpatialFilter,
  removeTemporalFilter,
  restoreCollections,
  restorePortal,
  restoreProject,
  saveShapefile,
  searchNlp,
  selectAccessMethod,
  setGranuleDownloadParams,
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
  updateCollectionGranuleFilters,
  updateCmrFacet,
  updateFeatureFacet,
  updateGranuleMetadata,
  updateGranuleQuery,
  updateGranuleResults,
  updateShapefile,
  viewCollectionDetails,
  viewCollectionGranules
}

export default actions
