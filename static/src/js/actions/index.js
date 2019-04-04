import { getCollections } from './collections'
import { getGranules } from './granules'
import { searchNlp } from './nlp'
import {
  changeFocusedCollection,
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
  changeUrl,
  clearFilters,
  getCollections,
  getGranules,
  masterOverlayPanelDragEnd,
  masterOverlayPanelDragStart,
  masterOverlayPanelResize,
  searchNlp
}

export default actions
