/* eslint-disable import/no-cycle */

import { getCollections, restoreCollections } from './collections'
import {
  changeFocusedCollection,
  clearCollectionGranules,
  getFocusedCollection
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
  changeQuery,
  changeProjectQuery,
  clearFilters,
  changeCollectionPageNum,
  changeGranulePageNum
} from './search'
import { changeMap } from './map'
import { changeUrl } from './urlQuery'
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
  toggleFacetsModal,
  toggleOverrideTemporalModal,
  toggleRelatedUrlsModal
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
  updateAccessMethod
} from './project'
import { submitOrder } from './orders'

const actions = {
  addProjectCollection,
  addGranulesFromCollection,
  applyViewAllFacets,
  changeCmrFacet,
  changeCollectionPageNum,
  changeFeatureFacet,
  changeFocusedCollection,
  changeFocusedGranule,
  changeGranulePageNum,
  changeMap,
  changeQuery,
  changeProjectQuery,
  changeTimelineQuery,
  changeUrl,
  changeViewAllFacet,
  clearCollectionGranules,
  clearFilters,
  excludeGranule,
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
  removeCollectionFromProject,
  restoreCollections,
  restoreProject,
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
  updateGranuleResults
}

export default actions
