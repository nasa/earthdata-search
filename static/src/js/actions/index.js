/* eslint-disable import/no-cycle */

import { getCollections } from './collections'
import { changeFocusedCollection } from './focusedCollection'
import { getGranules, updateGranules } from './granules'
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

const actions = {
  applyViewAllFacets,
  changeCmrFacet,
  changeCollectionPageNum,
  changeFeatureFacet,
  changeFocusedCollection,
  changeGranulePageNum,
  changeMap,
  changeQuery,
  changeTimelineQuery,
  changeTimelineState,
  changeUrl,
  changeViewAllFacet,
  clearFilters,
  getCollections,
  getGranules,
  getTimeline,
  getViewAllFacets,
  granuleResultsPanelUpdateSearchValue,
  granuleResultsPanelUpdateSortOrder,
  masterOverlayPanelDragEnd,
  masterOverlayPanelDragStart,
  masterOverlayPanelResize,
  searchNlp,
  toggleFacetsModal,
  triggerViewAllFacets,
  updateCmrFacet,
  updateFeatureFacet,
  updateGranules
}

export default actions
