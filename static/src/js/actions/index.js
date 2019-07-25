/* eslint-disable import/no-cycle */

import { getCollections, restoreCollections } from './collections'
import {
  changeFocusedCollection,
  clearCollectionGranules,
  getFocusedCollection,
  viewCollectionGranules,
  viewCollectionDetails
} from './focusedCollection'
import {
  addGranulesFromCollection,
  excludeGranule,
  getGranules,
  undoExcludeGranule,
  fetchGranuleLinks,
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
  removeTemporalFilter
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
  toggleSelectingNewGrid
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
import { fetchOrder, submitOrder } from './order'
import {
  fetchAccessMethods
} from './accessMethods'
import { saveShapefile, updateShapefile } from './shapefiles'

const actions = {
  addAccessMethods,
  addProjectCollection,
  addGranulesFromCollection,
  applyViewAllFacets,
  changeCmrFacet,
  changeCollectionPageNum,
  changeGranuleGridCoords,
  changeFeatureFacet,
  changeFocusedCollection,
  changeFocusedGranule,
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
  fetchOrder,
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
  toggleDrawingNewLayer,
  toggleSelectingNewGrid,
  removeCollectionFromProject,
  removeGridFilter,
  removeSpatialFilter,
  removeTemporalFilter,
  restoreCollections,
  restoreProject,
  saveShapefile,
  searchNlp,
  selectAccessMethod,
  submitOrder,
  toggleCollectionVisibility,
  toggleOverrideTemporalModal,
  toggleFacetsModal,
  toggleRelatedUrlsModal,
  triggerViewAllFacets,
  undoExcludeGranule,
  updateAccessMethod,
  updateAuthToken,
  updateCmrFacet,
  updateFeatureFacet,
  fetchGranuleLinks,
  setGranuleDownloadParams,
  updateGranuleMetadata,
  updateGranuleResults,
  updateShapefile,
  viewCollectionGranules,
  viewCollectionDetails
}

export default actions
