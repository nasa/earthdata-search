import { getCollections } from './collections'
import { getGranules } from './granules'
import { searchNlp } from './nlp'
import {
  changeQuery,
  changeFocusedCollection,
  clearFilters
} from './search'
import { changeMap } from './map'
import { changeUrl } from './urlQuery'
import toggleFacet from './facets'

const actions = {
  getCollections,
  getGranules,
  changeQuery,
  changeMap,
  changeFocusedCollection,
  changeUrl,
  clearFilters,
  searchNlp,
  toggleFacet
}

export default actions
