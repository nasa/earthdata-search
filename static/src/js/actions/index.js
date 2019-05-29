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
  updateGranuleResults,
  updateGranuleMetadata
} from './granules'
import { updateAuthToken } from './authToken'
import {
  changeTimelineQuery,
  changeTimelineState,
  getTimeline
} from './timeline'
import { searchNlp } from './nlp'
import {
  changeQuery,
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
  masterOverlayPanelDragEnd,
  masterOverlayPanelDragStart,
  masterOverlayPanelResize,
  granuleResultsPanelUpdateSortOrder,
  granuleResultsPanelUpdateSearchValue,
  toggleFacetsModal
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
  removeCollectionFromProject,
  getProjectGranules,
  getProjectCollections,
  toggleCollectionVisibility
} from './project'

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
  changeTimelineQuery,
  changeTimelineState,
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
  searchNlp,
  toggleCollectionVisibility,
  toggleFacetsModal,
  triggerViewAllFacets,
  undoExcludeGranule,
  updateAuthToken,
  updateCmrFacet,
  updateFeatureFacet,
  updateGranuleMetadata,
  updateGranuleResults
}

export default actions
