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

const actions = {
  getCollections,
  getGranules,
  changeQuery,
  changeMap,
  changeFocusedCollection,
  clearFilters,
  changeUrl,
  searchNlp
}

export default actions
