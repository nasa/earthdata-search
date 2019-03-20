import { getCollections } from './collections'
import { searchNlp } from './nlp'
import {
  changeQuery,
  changeP,
  clearFilters
} from './search'
import { changeUrl } from './urlQuery'

const actions = {
  getCollections,
  changeQuery,
  changeP,
  clearFilters,
  changeUrl,
  searchNlp
}

export default actions
