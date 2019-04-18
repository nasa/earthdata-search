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
  clearFilters
} from './search'
import { changeMap } from './map'
import { changeUrl } from './urlQuery'
import {
  changeCmrFacet,
  changeFeatureFacet
} from './facets'
import {
  masterOverlayPanelDragEnd,
  masterOverlayPanelDragStart,
  masterOverlayPanelResize
} from './ui'

const actions = {
  changeCmrFacet,
  changeFeatureFacet,
  changeFocusedCollection,
  changeMap,
  changeQuery,
  changeTimelineQuery,
  changeTimelineState,
  changeUrl,
  clearFilters,
  getCollections,
  getGranules,
  getTimeline,
  masterOverlayPanelDragEnd,
  masterOverlayPanelDragStart,
  masterOverlayPanelResize,
  searchNlp,
  updateGranules
}

export default actions
