import { getCollections } from './collections'
import { searchNlp } from './nlp'
import {
  changeQuery,
  changeP,
  clearFilters
} from './search'
import { changeMap } from './map'
import { changeUrl } from './urlQuery'

const actions = {
  getCollections,
  changeQuery,
  changeMap,
  changeP,
  clearFilters,
  changeUrl,
  searchNlp
}

export default actions
